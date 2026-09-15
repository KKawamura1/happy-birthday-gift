/*
 * data.js — 質問とプレゼント候補のデータ
 *
 * 考え方:
 *   - プレゼント候補(GIFTS)にはそれぞれ「タグ」がついている
 *   - 質問の選択肢(CHOICES)は、タグに点数を足したり引いたりする
 *   - 全部の質問を出すのではなく、いま候補がいちばん割れる質問を選んで出す(app.js)
 */

/* タグの日本語ラベル。結果画面の「なぜこれ？」に使う */
const TAG_LABELS = {
  food: 'おいしいもの',
  sweets: '甘いもの好き',
  savory: 'しょっぱいもの派',
  fruit: '果物好き',
  tea: 'お茶・コーヒー好き',
  alcohol: 'お酒好き',
  drink: '飲みもの',
  consumable: 'なくなるものがいい',
  keepsake: 'ずっと残るもの',
  practical: '毎日つかえるもの',
  luxury: 'ちょっと贅沢に',
  appliance: '家電',
  kitchen: '台所しごと',
  cleaning: '掃除・洗濯',
  relax: 'のんびりしたい',
  sleep: 'よく眠りたい',
  warm: '冷え対策',
  health: '体をいたわる',
  massage: '肩・腰がつらい',
  beauty: '美容',
  bath: 'お風呂の時間',
  towel: 'タオル・寝具',
  fashion: '身につけるもの',
  accessory: 'アクセサリー',
  roomwear: 'おうち時間の服',
  shoes: 'よく歩く',
  bag: 'お出かけ',
  experience: '体験',
  travel: '旅行',
  dining: '外でおいしいごはん',
  culture: '舞台・美術',
  outing: 'お出かけ好き',
  hobby: '趣味の時間',
  garden: '花・園芸',
  craft: '手芸',
  book: '読書',
  photo: '写真',
  family: '家族',
  together: '誰かと一緒に',
  tech_ok: '機械もへっちゃら',
  gadget: 'デジタルもの',
  home: 'おうち時間',
  active: 'アクティブ',
  budget_low: '気を遣わない価格',
  budget_mid: 'ほどよい価格',
  budget_high: '節目の贈りもの'
};

/* プレゼント候補 */
const GIFTS = [
  { id: 'sweets_set', emoji: '🍰', name: 'お取り寄せスイーツの詰め合わせ',
    budget: '3,000〜8,000円',
    note: '有名店のケーキやどら焼きを、冷凍便でおうちに。ひとつずつ食べる楽しみが続きます。',
    tags: ['food','sweets','consumable','budget_low','home'] },

  { id: 'fruit', emoji: '🍑', name: '旬の高級フルーツ',
    budget: '5,000〜12,000円',
    note: 'シャインマスカット、桃、いちごなど。季節ごとに届く定期便にもできます。',
    tags: ['food','fruit','consumable','budget_mid','luxury'] },

  { id: 'gourmet', emoji: '🦀', name: 'ご当地グルメ・海鮮セット',
    budget: '5,000〜15,000円',
    note: 'かに、うなぎ、明太子、干物など。ちょっといい晩ごはんが何回か。',
    tags: ['food','savory','consumable','budget_mid'] },

  { id: 'tea', emoji: '🍵', name: 'お茶・コーヒーの定期便',
    budget: '月 2,000〜4,000円',
    note: '毎月ちがう茶葉や豆が届きます。毎日の一杯がちょっと特別に。',
    tags: ['food','tea','drink','consumable','budget_low','home'] },

  { id: 'sake', emoji: '🍶', name: '日本酒・ワインの飲みくらべセット',
    budget: '5,000〜12,000円',
    note: '小瓶が何本か入ったセットなら、飲みきりやすくて選ぶ楽しみも。',
    tags: ['food','alcohol','consumable','budget_mid'] },

  { id: 'coffee_maker', emoji: '☕', name: '全自動コーヒーメーカー／上質な電気ケトル',
    budget: '8,000〜30,000円',
    note: 'ボタンひとつで挽きたての一杯。毎朝ちょっと嬉しくなる家電です。',
    tags: ['appliance','kitchen','drink','practical','tech_ok','budget_mid','home'] },

  { id: 'cook_pot', emoji: '🍲', name: '自動調理鍋・ホットプレート',
    budget: '15,000〜50,000円',
    note: '材料を入れてほっとくだけ。台所に立つ時間がぐっとラクになります。',
    tags: ['appliance','kitchen','practical','tech_ok','budget_mid'] },

  { id: 'robot_cleaner', emoji: '🤖', name: 'ロボット掃除機',
    budget: '30,000〜80,000円',
    note: '留守のあいだに掃除が終わっています。腰をかがめる回数が減ります。',
    tags: ['appliance','cleaning','practical','tech_ok','budget_high'] },

  { id: 'futon_dryer', emoji: '🛏️', name: '布団乾燥機',
    budget: '10,000〜25,000円',
    note: '寝る前に30分でぽかぽかの布団に。梅雨どきも冬もうれしい一台。',
    tags: ['appliance','cleaning','sleep','warm','practical','budget_mid'] },

  { id: 'hair_dryer', emoji: '💨', name: '高級ドライヤー',
    budget: '20,000〜50,000円',
    note: '自分ではなかなか買わない価格帯。乾かすだけで髪がつやっとします。',
    tags: ['beauty','appliance','luxury','practical','budget_high'] },

  { id: 'massager', emoji: '💆', name: 'マッサージクッション／マッサージガン',
    budget: '6,000〜30,000円',
    note: 'テレビを見ながら肩や腰に。押すボタンはひとつだけのものが人気です。',
    tags: ['appliance','massage','relax','health','home','budget_mid'] },

  { id: 'pajama', emoji: '🧸', name: '上質なパジャマ・ルームウェア',
    budget: '8,000〜20,000円',
    note: 'シルクやガーゼの肌ざわり。家にいる時間がいちばん長い服だからこそ。',
    tags: ['roomwear','fashion','relax','warm','sleep','home','budget_mid'] },

  { id: 'towel', emoji: '🛁', name: '今治タオル・バスローブのセット',
    budget: '5,000〜15,000円',
    note: '毎日ふれるものを、ちょっといいものに。何枚あっても困りません。',
    tags: ['towel','bath','relax','practical','budget_low'] },

  { id: 'bedding', emoji: '😴', name: 'オーダー枕・羽毛布団などの寝具',
    budget: '20,000〜60,000円',
    note: '人生の1/3は寝ている時間。合う枕に変えると朝がちがいます。',
    tags: ['sleep','towel','relax','practical','warm','budget_high'] },

  { id: 'bath_gift', emoji: '🧴', name: '入浴剤・バスグッズの詰め合わせ',
    budget: '3,000〜8,000円',
    note: '毎晩ひとつずつ選ぶ楽しみ。香りのちがうものが入ったセットで。',
    tags: ['bath','relax','warm','consumable','budget_low','home'] },

  { id: 'skincare', emoji: '✨', name: 'スキンケア・化粧品のギフトセット',
    budget: '8,000〜25,000円',
    note: 'いつも使っているものより、ワンランク上のものを。',
    tags: ['beauty','luxury','consumable','budget_mid'] },

  { id: 'jewelry', emoji: '💍', name: '真珠・誕生石のアクセサリー',
    budget: '20,000〜80,000円',
    note: '60歳の節目に。法事やお祝いの席でずっと使えるものを選べます。',
    tags: ['accessory','fashion','keepsake','luxury','budget_high'] },

  { id: 'stole', emoji: '🧣', name: '上質なストール・スカーフ',
    budget: '8,000〜25,000円',
    note: 'サイズを気にしなくていいのが利点。一枚あると肌寒い日に便利です。',
    tags: ['fashion','accessory','warm','keepsake','budget_mid'] },

  { id: 'shoes', emoji: '👟', name: '軽くて歩きやすい靴',
    budget: '10,000〜25,000円',
    note: '歩く時間が長い人ほど効きます。足に合うものを選べるギフト券も◎。',
    tags: ['shoes','fashion','active','practical','health','outing','budget_mid'] },

  { id: 'bag', emoji: '👜', name: '軽い本革のお出かけバッグ',
    budget: '20,000〜60,000円',
    note: '軽さがいちばん大事。旅行にもお出かけにも使えるサイズで。',
    tags: ['bag','fashion','active','outing','keepsake','budget_high'] },

  { id: 'onsen', emoji: '♨️', name: '温泉旅行・宿泊のギフト券',
    budget: '20,000〜60,000円',
    note: '日程は好きなときに選べます。お友だちや父と行ってもらっても。',
    tags: ['experience','travel','outing','luxury','relax','budget_high'] },

  { id: 'restaurant', emoji: '🍽️', name: 'レストランのお食事券',
    budget: '10,000〜30,000円',
    note: '自分ではなかなか行かないお店へ。ふたり分にしておくと使いやすいです。',
    tags: ['experience','dining','outing','food','budget_mid'] },

  { id: 'ticket', emoji: '🎭', name: '舞台・コンサート・美術展のチケット',
    budget: '8,000〜25,000円',
    note: '好きな演目を選んでもらえます。当日はごはんもセットにすると楽しい。',
    tags: ['experience','culture','outing','hobby','budget_mid'] },

  { id: 'catalog', emoji: '🎁', name: '体験ギフトのカタログ',
    budget: '10,000〜30,000円',
    note: '陶芸、クルーズ、エステ…。冊子から自分で選べるので失敗がありません。',
    tags: ['experience','outing','hobby','budget_mid'] },

  { id: 'flower', emoji: '💐', name: '花の定期便・寄せ植えセット',
    budget: '月 1,500〜4,000円',
    note: '毎月お花が届きます。「今月のが届いたよ」と連絡する口実にもなります。',
    tags: ['garden','hobby','consumable','home','budget_low','together'] },

  { id: 'craft', emoji: '🧶', name: '手芸キット／好きな作家の本',
    budget: '3,000〜10,000円',
    note: 'おうち時間のおともに。読みたかった本をまとめて贈るのもおすすめ。',
    tags: ['craft','book','hobby','home','budget_low'] },

  { id: 'photo_frame', emoji: '🖼️', name: 'デジタルフォトフレーム',
    budget: '15,000〜30,000円',
    note: '離れていても、こちらから写真を送ると自動で表示されます。設定は息子が。',
    tags: ['photo','family','together','gadget','tech_ok','keepsake','budget_mid','home'] },

  { id: 'photo_book', emoji: '📖', name: '家族写真のフォトブック＋手紙',
    budget: '3,000〜8,000円',
    note: '昔の写真と最近の写真をまとめて一冊に。値段では測れないやつです。',
    tags: ['photo','family','together','keepsake','budget_low','home'] },

  { id: 'tablet', emoji: '📱', name: 'ビデオ通話用のタブレット',
    budget: '30,000〜60,000円',
    note: '大きい画面で顔を見ながら話せます。初期設定を済ませてから送ります。',
    tags: ['gadget','tech_ok','family','together','practical','budget_high'] },

  { id: 'trip_together', emoji: '🚅', name: '一緒に行く旅行（息子が帰省＋小旅行）',
    budget: '相談して決める',
    note: 'いちばんの贈りものは時間かもしれません。日程だけ先に押さえます。',
    tags: ['together','family','experience','travel','outing','budget_high'] }
];

/*
 * 質問。tags の値がプラスなら「そのタグを持つプレゼントの点が上がる」、
 * マイナスなら下がる。3〜4 で強い影響、1〜2 でゆるい影響。
 */
const QUESTIONS = [
  { id: 'q_style', text: '誕生日は、どんなふうに過ごせたら嬉しいですか？',
    choices: [
      { emoji: '🏠', label: 'おうちでゆっくり', tags: { home: 3, relax: 2, outing: -2, experience: -2 } },
      { emoji: '🚶', label: 'どこかへ出かけたい', tags: { outing: 3, experience: 3, active: 2, home: -1 } },
      { emoji: '👨‍👩‍👦', label: '家族と話したり会ったり', tags: { family: 3, together: 3, photo: 2 } }
    ] },

  { id: 'q_form', text: 'プレゼント、どっちが好みですか？',
    choices: [
      { emoji: '🎀', label: 'ずっと残るもの', tags: { keepsake: 3, consumable: -3, practical: 1 } },
      { emoji: '🍽️', label: '食べたり使ったりしてなくなるもの', tags: { consumable: 3, food: 2, keepsake: -3 } },
      { emoji: '🤔', label: 'どちらでも嬉しい', tags: { practical: 1, experience: 1 } }
    ] },

  { id: 'q_want', text: '最近「これ欲しいなあ」と思ったのは、どれに近いですか？',
    choices: [
      { emoji: '🧹', label: '家のことがラクになるもの', tags: { appliance: 3, practical: 3, cleaning: 2, kitchen: 2 } },
      { emoji: '🛀', label: '自分を甘やかすもの', tags: { luxury: 3, relax: 3, beauty: 2, bath: 2 } },
      { emoji: '🎨', label: '楽しみ・趣味のもの', tags: { hobby: 3, culture: 2, craft: 2, garden: 2 } }
    ] },

  { id: 'q_taste', text: '食べものなら、どれがいちばん嬉しいですか？',
    choices: [
      { emoji: '🍡', label: '甘いもの', tags: { sweets: 4, food: 2 } },
      { emoji: '🍢', label: 'しょっぱいもの・お酒', tags: { savory: 3, alcohol: 3, food: 2, sweets: -2 } },
      { emoji: '🍇', label: '果物やお茶', tags: { fruit: 3, tea: 3, drink: 2, food: 2 } }
    ] },

  { id: 'q_tech', text: '新しい家電やデジタルものは、どうですか？',
    choices: [
      { emoji: '👍', label: '便利なら使ってみたい', tags: { tech_ok: 3, appliance: 2, gadget: 2 } },
      { emoji: '😅', label: '説明書を読むのは苦手', tags: { tech_ok: -3, gadget: -3, appliance: -2 } }
    ] },

  { id: 'q_body', text: 'からだのことで、いちばん気になるのは？',
    choices: [
      { emoji: '💆', label: '肩や腰がつらい', tags: { massage: 4, relax: 2, health: 3 } },
      { emoji: '🧦', label: '冷えが気になる', tags: { warm: 4, bath: 2, roomwear: 2 } },
      { emoji: '🌙', label: 'ぐっすり眠りたい', tags: { sleep: 4, relax: 2 } },
      { emoji: '💪', label: 'とくに元気です', tags: { active: 2, outing: 1, health: -1 } }
    ] },

  { id: 'q_outing', text: 'お出かけするなら、どれがいちばん楽しみ？',
    choices: [
      { emoji: '♨️', label: '温泉でのんびり', tags: { travel: 4, experience: 2, relax: 2 } },
      { emoji: '🍷', label: 'おいしいごはん', tags: { dining: 4, experience: 2, food: 2 } },
      { emoji: '🎼', label: '舞台・美術館・コンサート', tags: { culture: 4, experience: 2, hobby: 2 } }
    ] },

  { id: 'q_home', text: 'おうちにいる時間、何をしていることが多いですか？',
    choices: [
      { emoji: '📺', label: 'テレビや動画を見る', tags: { home: 2, relax: 2, massage: 1 } },
      { emoji: '🌱', label: '庭いじり・お花の世話', tags: { garden: 4, hobby: 2 } },
      { emoji: '🧵', label: '手芸や読書', tags: { craft: 3, book: 3, hobby: 2 } },
      { emoji: '🍳', label: '料理やお菓子づくり', tags: { kitchen: 4, appliance: 2 } }
    ] },

  { id: 'q_wear', text: '服やアクセサリーを贈られるのは、どうですか？',
    choices: [
      { emoji: '🙅', label: 'サイズも好みもあるので自分で選びたい', tags: { fashion: -3, accessory: -2, shoes: -2, bag: -2 } },
      { emoji: '💝', label: 'もらえたら嬉しい', tags: { fashion: 3, accessory: 3, keepsake: 2 } },
      { emoji: '🧸', label: 'パジャマや部屋着ならぜひ', tags: { roomwear: 4, home: 2, fashion: 1 } }
    ] },

  { id: 'q_budget', text: '息子からのプレゼント、値段はどのくらいが落ち着きますか？',
    choices: [
      { emoji: '🍪', label: '気を遣うから、お菓子くらいで十分', tags: { budget_low: 4, consumable: 2, budget_high: -3 } },
      { emoji: '🎂', label: '節目だし、少しいいものでも', tags: { budget_mid: 3, budget_low: -1 } },
      { emoji: '🎊', label: '60歳だし、長く使えるものを', tags: { budget_high: 4, keepsake: 2, luxury: 2, budget_low: -3 } }
    ] },

  { id: 'q_honne', text: 'ここだけの話。「値段は気にしなくていい」と言われたら、本当は？',
    sub: '息子には見えません…と言いたいところですが、最後に送れます。正直にどうぞ。',
    choices: [
      { emoji: '🍩', label: 'やっぱり食べものが一番うれしい', tags: { food: 3, consumable: 3, sweets: 1 } },
      { emoji: '🏆', label: 'ずっと使えるものが欲しい', tags: { keepsake: 3, budget_high: 2, luxury: 2 } },
      { emoji: '🌅', label: '思い出に残ることがしたい', tags: { experience: 4, together: 2, travel: 2 } }
    ] },

  { id: 'q_photo', text: '写真や手紙など、思い出のものはどうですか？',
    choices: [
      { emoji: '🖼️', label: '飾りたいし、何度も見返したい', tags: { photo: 4, family: 2, keepsake: 2 } },
      { emoji: '📦', label: 'もらっても置き場所に困るかも', tags: { photo: -3, keepsake: -1 } }
    ] },

  { id: 'q_with', text: '過ごすなら、ひとり？ 誰かと？',
    choices: [
      { emoji: '🧘', label: 'ひとりでのんびりが好き', tags: { home: 2, relax: 2, together: -2 } },
      { emoji: '🫶', label: '誰かと一緒がうれしい', tags: { together: 3, family: 2, dining: 1 } }
    ] },

  { id: 'q_replace', text: '毎日使うもので、そろそろ買い替えたいものはありますか？',
    choices: [
      { emoji: '🔪', label: '台所まわり', tags: { kitchen: 3, appliance: 3, practical: 2 } },
      { emoji: '🧺', label: '掃除・洗濯まわり', tags: { cleaning: 4, appliance: 3, practical: 2 } },
      { emoji: '🛌', label: 'タオルや寝具', tags: { towel: 4, sleep: 3, practical: 2 } },
      { emoji: '🆗', label: 'とくにない', tags: { practical: -2, luxury: 2, experience: 1 } }
    ] },

  { id: 'q_scent', text: '香りのあるものは好きですか？',
    choices: [
      { emoji: '🌸', label: '好き', tags: { bath: 3, beauty: 2, garden: 1 } },
      { emoji: '🚫', label: 'あまり得意ではない', tags: { bath: -3, beauty: -2 } }
    ] },

  { id: 'q_walk', text: '出かけるとき、歩くことは多いですか？',
    choices: [
      { emoji: '🚶‍♀️', label: 'よく歩きます', tags: { shoes: 3, bag: 2, active: 3, outing: 2 } },
      { emoji: '🚗', label: '車が多い／あまり歩かない', tags: { shoes: -2, active: -1, home: 1 } }
    ] }
];
