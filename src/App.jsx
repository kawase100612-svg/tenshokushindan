import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  { id: 1, text: "休日の過ごし方で一番近いのは？", options: [ { label: "新しいスキルや知識を習得する", value: "A" }, { label: "友人や家族と過ごす", value: "B" }, { label: "一人でクリエイティブな活動をする", value: "C" }, { label: "体を動かすスポーツや外出", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 2, text: "チームでプロジェクトをするとき、あなたはどんな役割が多い？", options: [ { label: "アイデアをたくさん出す人", value: "C" }, { label: "みんなをまとめるリーダー", value: "B" }, { label: "データや資料を整理する人", value: "A" }, { label: "実際に動いて形にする人", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 3, text: "仕事で一番大切にしたいものは？", options: [ { label: "社会への貢献・意義", value: "B" }, { label: "自由と裁量", value: "C" }, { label: "安定と専門性", value: "A" }, { label: "挑戦と成長", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 4, text: "得意なのはどちら？", options: [ { label: "論理的に考えて分析する", value: "A" }, { label: "人の気持ちを察して共感する", value: "B" }, { label: "ゼロからアイデアを生み出す", value: "C" }, { label: "行動して素早く結果を出す", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 5, text: "理想の職場環境は？", options: [ { label: "静かに集中できる環境", value: "A" }, { label: "人との対話が多い環境", value: "B" }, { label: "自分のスタイルで働ける環境", value: "C" }, { label: "変化が多くダイナミックな環境", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 6, text: "問題に直面したとき、最初にすることは？", options: [ { label: "情報を集めて徹底的に調べる", value: "A" }, { label: "周りに相談して意見を聞く", value: "B" }, { label: "ユニークな解決策を考える", value: "C" }, { label: "とにかく動いて試してみる", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 7, text: "子どもの頃、何が好きでしたか？", options: [ { label: "読書・勉強・パズル", value: "A" }, { label: "友達と遊ぶ・お世話する", value: "B" }, { label: "絵を描く・モノを作る", value: "C" }, { label: "スポーツ・外遊び・冒険", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 8, text: "苦手なことは？", options: [ { label: "あいまいな指示で動くこと", value: "A" }, { label: "競争や対立", value: "B" }, { label: "ルールに縛られること", value: "C" }, { label: "ルーティン作業の繰り返し", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 9, text: "将来どんな人になりたい？", options: [ { label: "その分野の第一人者・専門家", value: "A" }, { label: "人から頼られる存在", value: "B" }, { label: "自分だけの世界観を持つ人", value: "C" }, { label: "変化を起こすリーダー", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
  { id: 10, text: "仕事の成功を感じるのはどんなとき？", options: [ { label: "正確で質の高い成果を出したとき", value: "A" }, { label: "誰かの役に立てたと感じるとき", value: "B" }, { label: "自分の表現が評価されたとき", value: "C" }, { label: "目標を達成・突破したとき", value: "D" }, { label: "どれも当てはまらない", value: "N" } ] },
];

const TYPES = {
  A: { name: "専門家・分析タイプ", emoji: "🔬", color: "#60a5fa", glow: "rgba(96,165,250,0.4)", keywords: ["論理的", "緻密", "専門志向", "探究心"], description: "論理的思考力と深い集中力を持ち、物事を徹底的に追求できるあなた。データや事実をもとに判断し、専門性を積み上げることで大きな価値を発揮します。", strengths: [ { icon: "🧠", title: "深い分析力", text: "データや情報を体系的に整理し、本質を見抜く力があります。複雑な問題も論理的に分解して解決できます。" }, { icon: "🎯", title: "高い専門性", text: "一つの分野を深く掘り下げる姿勢が、誰にも真似できない専門知識を生み出します。" }, { icon: "⚡", title: "集中力と持続力", text: "興味を持ったことへの集中力が高く、長時間でも質の高いアウトプットを維持できます。" } ], weaknesses: "一方で、完璧主義になりやすく決断に時間がかかる場面も。「80点で前進する」意識が成長を加速させます。", jobs: [ { rank: 1, title: "エンジニア・プログラマー", reason: "論理的に問題を解決する力と、細部へのこだわりが直接活かせる職種。システム設計や開発で専門性を磨けます。", examples: ["Webエンジニア", "AIエンジニア", "データサイエンティスト", "インフラエンジニア"] }, { rank: 2, title: "研究者・科学者", reason: "一つのテーマを深く追求する姿勢が研究の世界でそのまま強みになります。学術・民間問わず活躍できます。", examples: ["大学研究員", "製薬研究者", "市場調査アナリスト", "気象予報士"] }, { rank: 3, title: "会計士・税理士・財務", reason: "正確さへのこだわりと数字への強さが、財務・会計の世界で高く評価されます。資格取得でさらに安定します。", examples: ["公認会計士", "税理士", "財務アナリスト", "FP（ファイナンシャルプランナー）"] } ], famous: [{ name: "イーロン・マスク", reason: "エンジニアリングへの深い理解と論理的思考でSpaceX・Teslaを構築" }, { name: "山中伸弥教授", reason: "一つの研究テーマを何年も追い続けiPS細胞を発見、ノーベル賞受賞" }], advice: "あなたの強みは「深さ」です。一つの分野を極めることで、誰にも真似できない専門家になれます。最初は時間がかかっても、積み上げた知識は一生の財産になります。焦らず着実に、自分のペースで進んでください。" },
  B: { name: "サポーター・共感タイプ", emoji: "🤝", color: "#34d399", glow: "rgba(52,211,153,0.4)", keywords: ["共感力", "思いやり", "チームワーク", "信頼"], description: "人の気持ちを自然に察し、誰かの力になることに喜びを感じるあなた。コミュニケーション能力と思いやりの深さが、人を動かす大きな力になります。", strengths: [ { icon: "💚", title: "高い共感力", text: "相手の気持ちや状況を自然に察知し、最適なサポートができます。人が安心して頼れる存在です。" }, { icon: "🗣️", title: "卓越したコミュニケーション", text: "言葉だけでなく、表情や雰囲気でも相手に安心感を与えます。対話を通じて信頼関係を築くのが得意です。" }, { icon: "🌱", title: "人を育てる力", text: "相手の可能性を信じ、長期的に関わりながら成長を支援できます。教育・指導の場面で真価を発揮します。" } ], weaknesses: "頼まれると断れず、自分を後回しにしやすい面も。自分自身のケアも大切な「仕事」だと意識しましょう。", jobs: [ { rank: 1, title: "教師・講師・コーチ", reason: "人の成長を支えることへの喜びと、伝える力が組み合わさる最高の職種。教育の現場でやりがいを感じられます。", examples: ["学校教師", "塾講師", "スポーツコーチ", "キャリアカウンセラー"] }, { rank: 2, title: "医療・福祉・看護", reason: "共感力と人への誠実さが、医療や福祉の現場で最も必要とされる資質です。人の命に関わる意義ある仕事です。", examples: ["看護師", "作業療法士", "社会福祉士", "介護福祉士"] }, { rank: 3, title: "HR・人事・採用", reason: "人を見る目と、信頼関係を築く力が、組織の中核を担う人事の仕事で大きく輝きます。", examples: ["人事担当", "採用コンサルタント", "組織開発", "研修トレーナー"] } ], famous: [{ name: "マザー・テレサ", reason: "徹底した共感と奉仕の精神で世界中の人々に影響を与えた" }, { name: "羽生結弦", reason: "チームへの感謝と人との繋がりを大切にしながら世界トップへ" }], advice: "あなたの強みは「人との繋がり」です。誰かを助けたときの充実感を大切にしてください。人に関わる仕事は感情的に消耗することもありますが、自分のケアも忘れずに。あなたが笑顔でいることが、周りの人の力にもなります。" },
  C: { name: "クリエイター・表現タイプ", emoji: "🎨", color: "#f472b6", glow: "rgba(244,114,182,0.4)", keywords: ["独創性", "感性", "表現力", "自由"], description: "独自の視点と豊かな感性を持ち、ゼロから何かを生み出すことに情熱を燃やすあなた。ルールより自由を、模倣より独創を選ぶ姿勢が、唯一無二の表現を生み出します。", strengths: [ { icon: "✨", title: "唯一無二の独創性", text: "既存の枠に収まらないアイデアを生み出す力があります。「こんな視点があったのか」と周りを驚かせる発想が武器です。" }, { icon: "🎭", title: "豊かな表現力", text: "自分の内側にあるものを形にする力が高く、作品・言葉・映像など様々な媒体で人の心を動かせます。" }, { icon: "🔥", title: "情熱と持続するモチベーション", text: "好きなことへの情熱が強く、誰に言われなくても自発的に動き続けられます。" } ], weaknesses: "締め切りや管理が苦手な面も。ビジネス的な視点を一つ加えることで、才能がさらに大きく花開きます。", jobs: [ { rank: 1, title: "デザイナー・クリエイター", reason: "あなたの独創的な視点と美的感覚が、デザインの世界でそのまま価値になります。幅広い分野で活躍できます。", examples: ["グラフィックデザイナー", "UIデザイナー", "映像クリエイター", "イラストレーター"] }, { rank: 2, title: "ライター・コンテンツ制作", reason: "自分の世界観を言葉や映像で表現する力が、コンテンツの時代にますます求められています。", examples: ["コピーライター", "シナリオライター", "YouTuber・動画編集者", "SNSコンテンツ制作"] }, { rank: 3, title: "起業家・フリーランス", reason: "自由と裁量を求める姿勢と、新しいアイデアを形にする力が、独立・起業に向いています。", examples: ["フリーランスデザイナー", "Webコンサルタント", "アプリ開発者", "オンラインビジネス"] } ], famous: [{ name: "スティーブ・ジョブズ", reason: "独自の美学と創造性でテクノロジーとデザインを融合し世界を変えた" }, { name: "村上春樹", reason: "独特の世界観と表現力で世界中の読者の心を掴み続ける" }], advice: "あなたの強みは「独創性」です。「こんなアイデア変かな」と思ったものほど、実は世界を変える可能性を持っています。比べるのは過去の自分だけ。あなたにしか作れないものを信じて、一歩ずつ形にしていきましょう。" },
  D: { name: "リーダー・行動タイプ", emoji: "🚀", color: "#fb923c", glow: "rgba(251,146,60,0.4)", keywords: ["行動力", "推進力", "挑戦", "突破力"], description: "エネルギッシュで行動力があり、挑戦と変化を自ら求めるあなた。目標に向かって突き進む推進力と、周りを巻き込む熱量が、大きな結果を生み出します。", strengths: [ { icon: "⚡", title: "圧倒的な行動力", text: "考えすぎずに動ける力が最大の武器。チャンスを誰より早くつかみ、経験を積み重ねることで急成長できます。" }, { icon: "🔥", title: "周りを巻き込む熱量", text: "あなたの情熱とエネルギーは周囲に伝染します。自然と人がついてきて、チームを前に進める力があります。" }, { icon: "🏆", title: "結果にこだわる意志", text: "目標を設定したら諦めない粘り強さがあります。困難な状況でも突破口を見つけて前進できます。" } ], weaknesses: "スピード重視で細部を見落とす場面も。立ち止まって振り返る時間を作ることで、さらに大きな成果につながります。", jobs: [ { rank: 1, title: "営業・ビジネス開発", reason: "結果にこだわる姿勢と、人を動かすエネルギーが営業の世界で最大の武器になります。成果がダイレクトに見える爽快さもあります。", examples: ["法人営業", "不動産営業", "医療MR", "ビジネス開発（BizDev）"] }, { rank: 2, title: "マネージャー・経営者", reason: "チームをまとめ、目標に向かって引っ張るリーダーシップが、管理職・経営の場で最大限に活きます。", examples: ["プロジェクトマネージャー", "店長・マネージャー", "スタートアップ経営者", "事業部長"] }, { rank: 3, title: "スポーツ・体を使う仕事", reason: "身体を動かすことへの情熱と、勝負・挑戦が好きな姿勢が、スポーツや体力系の仕事でそのまま活きます。", examples: ["プロスポーツ選手", "スポーツトレーナー", "消防士・警察官", "建設・現場監督"] } ], famous: [{ name: "孫正義", reason: "誰も想像しなかったビジョンを描き、圧倒的な行動力で実現し続けるリーダー" }, { name: "大谷翔平", reason: "高い目標を掲げ、努力と行動で二刀流という前人未踏の領域を切り拓いた" }], advice: "あなたの強みは「行動力」です。考えすぎる前に動ける人は、チャンスを誰より早くつかめます。失敗を恐れず、むしろ経験として前に進んでください。あなたのエネルギーは周りの人を自然と引き上げます。" },
};

function diagnose(answers) {
  const count = { A: 0, B: 0, C: 0, D: 0 };
  answers.forEach((a) => { if (a !== "N") count[a] = (count[a] || 0) + 1; });
  const sorted = Object.entries(count).sort((x, y) => y[1] - x[1]);
  return { type: TYPES[sorted[0][0]], secondType: TYPES[sorted[1][0]], scores: count };
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particles = Array.from({ length: 90 }, () => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.4 + 0.3, dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25, alpha: Math.random() * 0.45 + 0.08 }));
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.x += p.dx; p.y += p.dy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(245,200,66,${p.alpha})`; ctx.fill(); });
      animId = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />;
}

function ProgressBar({ current, total }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#9d8ec7", marginBottom: "0.5rem" }}>
        <span>質問 {current} / {total}</span><span>{Math.round((current / total) * 100)}%</span>
      </div>
      <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: "linear-gradient(90deg, #7c5cbf, #f5c842)", borderRadius: "2px", transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#9d8ec7", marginBottom: "0.25rem" }}>
        <span>{label}</span><span>{value}/{max}</span>
      </div>
      <div style={{ height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: "3px", transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState("start");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  function handleStart() { setStep("quiz"); setCurrentQ(0); setAnswers([]); setSelected(null); setResult(null); }

  function handleBack() {
    if (currentQ === 0) { setStep("start"); return; }
    setAnimating(true);
    setTimeout(() => { setAnswers(answers.slice(0, -1)); setCurrentQ(currentQ - 1); setSelected(null); setAnimating(false); }, 180);
  }

  function handleNext() {
    if (!selected || animating) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    if (currentQ + 1 < QUESTIONS.length) {
      setAnimating(true);
      setTimeout(() => { setCurrentQ(currentQ + 1); setSelected(null); setAnimating(false); }, 180);
    } else {
      setStep("loading");
      setTimeout(() => { setResult(diagnose(newAnswers)); setStep("result"); }, 1800);
    }
  }

  const q = QUESTIONS[currentQ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0e0820 0%, #1a1035 50%, #0d1525 100%)", fontFamily: "'Hiragino Sans','Hiragino Kaku Gothic ProN','Yu Gothic',sans-serif", position: "relative", color: "#f0eef8" }}>
      <ParticleCanvas />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "540px", margin: "0 auto", padding: "2rem 1.25rem 4rem", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {step === "start" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem", filter: "drop-shadow(0 0 20px rgba(245,200,66,0.5))" }}>✦</div>
            <h1 style={{ fontSize: "2.2rem", fontWeight: "800", background: "linear-gradient(135deg, #f5c842, #c4a0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.6rem" }}>適職診断</h1>
            <p style={{ color: "#9d8ec7", fontSize: "0.875rem", lineHeight: "1.8", marginBottom: "2.5rem" }}>10の質問であなたに向いている<br />仕事を本格診断します</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {["🔬 専門家", "🤝 サポーター", "🎨 クリエイター", "🚀 リーダー"].map((t, i) => (
                <div key={i} style={{ fontSize: "0.65rem", color: "#5a4e7a", textAlign: "center", lineHeight: "1.5" }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.15rem" }}>{t.split(" ")[0]}</div>{t.split(" ")[1]}
                </div>
              ))}
            </div>
            <button onClick={handleStart} style={{ background: "linear-gradient(135deg, #7c5cbf, #f5c842)", color: "#0e0820", border: "none", borderRadius: "50px", padding: "0.95rem 2.8rem", fontSize: "1rem", fontWeight: "800", cursor: "pointer", fontFamily: "inherit" }}>診断スタート</button>
            <p style={{ color: "#5a4e7a", fontSize: "0.72rem", marginTop: "1.1rem" }}>所要時間：約2〜3分</p>
          </div>
        )}

        {step === "quiz" && (
          <div style={{ opacity: animating ? 0 : 1, transition: "opacity 0.15s ease" }}>
            <ProgressBar current={currentQ + 1} total={QUESTIONS.length} />
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "1.5rem 1.25rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "1.05rem", fontWeight: "700", lineHeight: "1.65", color: "#f0eef8", marginBottom: "1.25rem" }}>{q.text}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {q.options.map((opt) => (
                  <button key={opt.value} onClick={() => setSelected(opt.value)} style={{
                    background: opt.value === "N" ? (selected === "N" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)") : (selected === opt.value ? "linear-gradient(135deg, rgba(124,92,191,0.35), rgba(245,200,66,0.12))" : "rgba(255,255,255,0.03)"),
                    border: opt.value === "N" ? (selected === "N" ? "1px solid rgba(255,255,255,0.25)" : "1px dashed rgba(255,255,255,0.12)") : (selected === opt.value ? "1px solid rgba(245,200,66,0.55)" : "1px solid rgba(255,255,255,0.07)"),
                    borderRadius: "10px", padding: "0.78rem 1rem",
                    color: opt.value === "N" ? (selected === "N" ? "#c4b5e8" : "#5a4e7a") : (selected === opt.value ? "#f5c842" : "#c4b5e8"),
                    fontSize: opt.value === "N" ? "0.8rem" : "0.875rem", fontWeight: selected === opt.value ? "700" : "400",
                    textAlign: "left", cursor: "pointer", transition: "all 0.15s ease", fontFamily: "inherit",
                  }}>
                    {opt.value === "N" ? `— ${opt.label}` : opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.65rem" }}>
              <button onClick={handleBack} style={{ flex: "0 0 auto", background: "rgba(255,255,255,0.05)", color: "#9d8ec7", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50px", padding: "0.85rem 1.25rem", fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit" }}>← 戻る</button>
              <button onClick={handleNext} disabled={!selected} style={{ flex: 1, background: selected ? "linear-gradient(135deg, #7c5cbf, #f5c842)" : "rgba(255,255,255,0.05)", color: selected ? "#0e0820" : "#5a4e7a", border: "none", borderRadius: "50px", padding: "0.85rem", fontSize: "0.95rem", fontWeight: "800", cursor: selected ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
                {currentQ + 1 === QUESTIONS.length ? "診断する ✦" : "次へ →"}
              </button>
            </div>
          </div>
        )}

        {step === "loading" && (
          <div style={{ textAlign: "center" }}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:0.5;}50%{opacity:1;} }`}</style>
            <div style={{ width: "64px", height: "64px", margin: "0 auto 1.5rem", border: "3px solid rgba(245,200,66,0.12)", borderTop: "3px solid #f5c842", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
            <p style={{ color: "#c4b5e8", fontSize: "1rem", fontWeight: "600", marginBottom: "0.4rem" }}>分析中...</p>
            <p style={{ color: "#5a4e7a", fontSize: "0.8rem", animation: "pulse 1.5s ease infinite" }}>あなたの回答パターンを診断しています</p>
          </div>
        )}

        {step === "result" && result && (
          <div>
            <style>{`@keyframes fadeUp { from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);} }`}</style>

            <div style={{ textAlign: "center", marginBottom: "1.5rem", animation: "fadeUp 0.5s ease both" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem", filter: `drop-shadow(0 0 16px ${result.type.glow})` }}>{result.type.emoji}</div>
              <div style={{ fontSize: "0.72rem", color: "#9d8ec7", letterSpacing: "0.12em", marginBottom: "0.3rem" }}>あなたは</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: result.type.color, marginBottom: "0.4rem", textShadow: `0 0 20px ${result.type.glow}` }}>{result.type.name}</h2>
              <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                {result.type.keywords.map((k, i) => (
                  <span key={i} style={{ background: `${result.type.color}22`, border: `1px solid ${result.type.color}44`, borderRadius: "20px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", color: result.type.color }}>{k}</span>
                ))}
              </div>
              <div style={{ fontSize: "0.7rem", color: "#5a4e7a" }}>サブタイプ：{result.secondType.emoji} {result.secondType.name}</div>
            </div>

            <div style={{ background: `linear-gradient(135deg, ${result.type.glow.replace("0.4","0.12")}, rgba(255,255,255,0.02))`, border: `1px solid ${result.type.color}33`, borderRadius: "14px", padding: "1.25rem 1.4rem", marginBottom: "1.1rem", animation: "fadeUp 0.5s ease 0.1s both" }}>
              <p style={{ fontSize: "0.72rem", color: result.type.color, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>▸ あなたについて</p>
              <p style={{ fontSize: "0.88rem", lineHeight: "1.8", color: "#e2daf5" }}>{result.type.description}</p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "1.1rem 1.4rem", marginBottom: "1.1rem", animation: "fadeUp 0.5s ease 0.15s both" }}>
              <p style={{ fontSize: "0.72rem", color: "#9d8ec7", letterSpacing: "0.08em", marginBottom: "0.85rem" }}>▸ あなたの3つの強み</p>
              {result.type.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: i < 2 ? "0.85rem" : 0 }}>
                  <div style={{ fontSize: "1.3rem", flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: "700", color: result.type.color, marginBottom: "0.2rem" }}>{s.title}</p>
                    <p style={{ fontSize: "0.78rem", color: "#b0a3d4", lineHeight: "1.65" }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "0.9rem 1.2rem", marginBottom: "1.1rem", animation: "fadeUp 0.5s ease 0.2s both" }}>
              <p style={{ fontSize: "0.72rem", color: "#9d8ec7", marginBottom: "0.3rem" }}>▸ 成長のヒント</p>
              <p style={{ fontSize: "0.78rem", color: "#7a6ea0", lineHeight: "1.65" }}>{result.type.weaknesses}</p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "1.1rem 1.4rem", marginBottom: "1.1rem", animation: "fadeUp 0.5s ease 0.25s both" }}>
              <p style={{ fontSize: "0.72rem", color: "#9d8ec7", marginBottom: "0.75rem" }}>▸ タイプ別スコア</p>
              <ScoreBar label="🔬 専門家タイプ" value={result.scores.A || 0} max={10} color={TYPES.A.color} />
              <ScoreBar label="🤝 サポータータイプ" value={result.scores.B || 0} max={10} color={TYPES.B.color} />
              <ScoreBar label="🎨 クリエイタータイプ" value={result.scores.C || 0} max={10} color={TYPES.C.color} />
              <ScoreBar label="🚀 リーダータイプ" value={result.scores.D || 0} max={10} color={TYPES.D.color} />
            </div>

            <div style={{ animation: "fadeUp 0.5s ease 0.3s both" }}>
              <p style={{ fontSize: "0.72rem", color: "#9d8ec7", marginBottom: "0.75rem" }}>▸ あなたの適職ランキング</p>
              {result.type.jobs.map((job, i) => (
                <div key={i} style={{ background: i === 0 ? `linear-gradient(135deg, ${result.type.glow.replace("0.4","0.18")}, rgba(255,255,255,0.02))` : "rgba(255,255,255,0.03)", border: i === 0 ? `1px solid ${result.type.color}44` : "1px solid rgba(255,255,255,0.07)", borderRadius: "13px", padding: "1.1rem 1.3rem", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                    <span style={{ background: i === 0 ? result.type.color : "rgba(255,255,255,0.1)", color: i === 0 ? "#0e0820" : "#9d8ec7", borderRadius: "50%", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: "800", flexShrink: 0 }}>{job.rank}</span>
                    <span style={{ fontWeight: "700", fontSize: "0.95rem", color: i === 0 ? result.type.color : "#e2daf5" }}>{job.title}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#b0a3d4", lineHeight: "1.65", marginBottom: "0.6rem" }}>{job.reason}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {job.examples.map((ex, j) => (
                      <span key={j} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "0.2rem 0.65rem", fontSize: "0.72rem", color: "#9d8ec7" }}>{ex}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "1.1rem 1.4rem", marginBottom: "1.1rem", animation: "fadeUp 0.5s ease 0.35s both" }}>
              <p style={{ fontSize: "0.72rem", color: "#9d8ec7", marginBottom: "0.75rem" }}>▸ 同じタイプの著名人</p>
              {result.type.famous.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: i < result.type.famous.length - 1 ? "0.7rem" : 0 }}>
                  <div style={{ fontSize: "1.2rem", flexShrink: 0 }}>⭐</div>
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: "700", color: "#e2daf5", marginBottom: "0.15rem" }}>{f.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "#7a6ea0", lineHeight: "1.6" }}>{f.reason}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "linear-gradient(135deg, rgba(124,92,191,0.15), rgba(245,200,66,0.06))", border: "1px solid rgba(245,200,66,0.2)", borderRadius: "13px", padding: "1.2rem 1.4rem", marginBottom: "1.25rem", animation: "fadeUp 0.5s ease 0.4s both" }}>
              <p style={{ fontSize: "0.72rem", color: "#f5c842", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>✦ あなたへのメッセージ</p>
              <p style={{ fontSize: "0.85rem", lineHeight: "1.8", color: "#e2daf5" }}>{result.type.advice}</p>
            </div>

            <button onClick={handleStart} style={{ width: "100%", background: "transparent", color: "#9d8ec7", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50px", padding: "0.8rem", fontSize: "0.875rem", cursor: "pointer", fontFamily: "inherit", animation: "fadeUp 0.5s ease 0.45s both" }}>
              もう一度診断する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
