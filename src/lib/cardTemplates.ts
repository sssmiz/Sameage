export interface CardTemplate {
  type: string;
  question: string;
  hint: string;
}

export const cardTemplates: CardTemplate[] = [
  {
    type: "DREAM",
    question: "{{age}}歳のとき、将来の夢は何でしたか？\n今の自分に近い夢でしたか？",
    hint: "夢が変わっていても、変わっていなくてもOK。聞いてみよう。",
  },
  {
    type: "FEAR",
    question: "{{age}}歳のとき、一番怖かったことや\n不安だったことは何ですか？",
    hint: "失敗への不安、人間関係、将来への焦り。誰でも持っていたはず。",
  },
  {
    type: "SECRET",
    question: "{{age}}歳のとき、親に言えなかった\n秘密や本音はありましたか？",
    hint: "言えなかった言葉が、今日のヒントかもしれない。",
  },
  {
    type: "JOY",
    question: "{{age}}歳のとき、何が一番楽しかった？\n毎週何をして過ごしていましたか？",
    hint: "当時の日常がそのまま、その人の性格を表している。",
  },
  {
    type: "REGRET",
    question: "{{age}}歳の自分に、今の自分なら\n何を伝えたいですか？",
    hint: "この答えの中に、お父さんがあなたに本当に伝えたいことがあるかもしれない。",
  },
];
