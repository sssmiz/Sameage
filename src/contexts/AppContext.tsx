import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, collection, query, where, serverTimestamp, updateDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";

interface FamilyData {
  code?: string;
  childAge?: number;
  fatherAge?: number;
  fatherName?: string;
  members?: Record<string, string>;
  solo?: boolean;
  [key: string]: unknown;
}

interface AnswerData {
  cardType: string;
  question: string;
  targetAge: number;
  father?: { text: string };
  child?: { text: string };
}

interface AppContextType {
  currentUser: User | null;
  userRole: string | null;
  familyId: string | null;
  familyData: FamilyData | null;
  fatherName: string;
  targetAge: number;
  loading: boolean;
  setUserRole: (role: string) => void;
  setFamilyId: (id: string | null) => void;
  setFamilyData: (data: FamilyData | null) => void;
  setFatherName: (name: string) => void;
  setTargetAge: (age: number) => void;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  checkExistingFamily: () => Promise<"setup" | "role">;
  createFamily: () => Promise<string>;
  joinFamily: (code: string) => Promise<boolean>;
  saveSetup: (childAge: number, fatherAge: number, name: string) => Promise<void>;
  saveAnswer: (cardIndex: number, cardType: string, questionText: string, who: string, text: string) => Promise<void>;
  loadCompareData: () => Promise<AnswerData[]>;
  loadHistory: () => Promise<Record<string, AnswerData[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyData, setFamilyData] = useState<FamilyData | null>(null);
  const [fatherName, setFatherName] = useState("お父さん");
  const [targetAge, setTargetAge] = useState(18);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp(),
      }, { merge: true }).catch((e) => console.warn("Firestore save skipped:", e));
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast("ログインがキャンセルされました");
      } else if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment", "auth/unauthorized-domain"].includes(error.code)) {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (e) {
          toast.error("ログインに失敗しました。Firebaseの承認済みドメインを確認してください。");
        }
      } else {
        toast.error("ログインエラーが発生しました");
      }
    }
  };

  const logoutFn = async () => {
    await signOut(auth);
    setUserRole(null);
    setFamilyId(null);
    setFamilyData(null);
  };

  const checkExistingFamily = async (): Promise<"setup" | "role"> => {
    if (!currentUser) return "role";
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      if (userData?.familyId) {
        setFamilyId(userData.familyId);
        setUserRole(userData.role);
        const familyDoc = await getDoc(doc(db, "families", userData.familyId));
        if (familyDoc.exists()) {
          const fd = familyDoc.data() as FamilyData;
          setFamilyData(fd);
          setFatherName(fd.fatherName || "お父さん");
          setTargetAge(fd.childAge || 18);
          toast(`おかえりなさい！（${userData.role === "father" ? "父親" : "子供"}として参加中）`);
          return "setup";
        }
      }
    } catch (err) {
      console.warn("Family check skipped:", err);
    }
    return "role";
  };

  const createFamily = async (): Promise<string> => {
    if (!currentUser) throw new Error("Not logged in");
    const code = generateCode();
    const fid = "family_" + Date.now();
    await setDoc(doc(db, "families", fid), {
      code,
      createdAt: serverTimestamp(),
      members: { [userRole || "father"]: currentUser.uid },
      createdBy: currentUser.uid,
    });
    await updateDoc(doc(db, "users", currentUser.uid), { familyId: fid, role: userRole });
    setFamilyId(fid);
    return code;
  };

  const joinFamily = async (inputCode: string): Promise<boolean> => {
    if (!currentUser) return false;
    const q2 = query(collection(db, "families"), where("code", "==", inputCode));
    const snap = await getDocs(q2);
    if (snap.empty) {
      toast.error("コードが見つかりません");
      return false;
    }
    const familyDoc = snap.docs[0];
    const fid = familyDoc.id;
    const fd = familyDoc.data() as FamilyData;
    await updateDoc(doc(db, "families", fid), { [`members.${userRole}`]: currentUser.uid });
    await updateDoc(doc(db, "users", currentUser.uid), { familyId: fid, role: userRole });
    setFamilyId(fid);
    setFamilyData(fd);
    return true;
  };

  const saveSetup = async (childAge: number, fatherAge: number, name: string) => {
    if (!currentUser) return;
    setTargetAge(childAge);
    setFatherName(name || "お父さん");

    let fid = familyId;
    if (fid) {
      await updateDoc(doc(db, "families", fid), { childAge, fatherAge, fatherName: name }).catch(() => {});
    } else {
      fid = "solo_" + currentUser.uid;
      await setDoc(doc(db, "families", fid), {
        childAge, fatherAge, fatherName: name,
        members: { [userRole || "child"]: currentUser.uid },
        createdAt: serverTimestamp(),
        solo: true,
      }, { merge: true });
      await updateDoc(doc(db, "users", currentUser.uid), { familyId: fid, role: userRole || "child" });
      setFamilyId(fid);
    }
  };

  const saveAnswer = async (cardIndex: number, cardType: string, questionText: string, who: string, text: string) => {
    if (!familyId || !currentUser || !text) return;
    const year = new Date().getFullYear();
    const answerId = `q${cardIndex}`;
    try {
      await setDoc(doc(db, "families", familyId, "sessions", String(year), "answers", answerId), {
        [who]: { text, answeredAt: serverTimestamp(), answeredBy: currentUser.uid },
        cardType, question: questionText, targetAge,
      }, { merge: true });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const loadCompareData = async (): Promise<AnswerData[]> => {
    if (!familyId) return [];
    const year = new Date().getFullYear();
    const snap = await getDocs(collection(db, "families", familyId, "sessions", String(year), "answers"));
    return snap.docs
      .sort((a, b) => parseInt(a.id.replace("q", "")) - parseInt(b.id.replace("q", "")))
      .map((d) => d.data() as AnswerData);
  };

  const loadHistory = async (): Promise<Record<string, AnswerData[]>> => {
    if (!familyId) return {};
    const sessionsSnap = await getDocs(collection(db, "families", familyId, "sessions"));
    const result: Record<string, AnswerData[]> = {};
    for (const s of sessionsSnap.docs) {
      const answersSnap = await getDocs(collection(db, "families", familyId, "sessions", s.id, "answers"));
      result[s.id] = answersSnap.docs
        .sort((a, b) => parseInt(a.id.replace("q", "")) - parseInt(b.id.replace("q", "")))
        .map((d) => d.data() as AnswerData);
    }
    return result;
  };

  return (
    <AppContext.Provider value={{
      currentUser, userRole, familyId, familyData, fatherName, targetAge, loading,
      setUserRole, setFamilyId, setFamilyData, setFatherName, setTargetAge,
      googleLogin, logout: logoutFn, checkExistingFamily, createFamily, joinFamily,
      saveSetup, saveAnswer, loadCompareData, loadHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
