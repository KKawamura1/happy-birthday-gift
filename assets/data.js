/*
 * data.js — 質問とプレゼント候補のデータ
 *
 * 考え方:
 *   - プレゼント候補(GIFTS)にはそれぞれ「タグ」がついている
 *   - 質問の選択肢の tags は、そのタグに点数を足したり引いたりする
 *   - 全部の質問を出すのではなく、いま候補がいちばん割れる質問を選んで出す(app.js)
 *
 * 金額はどこにも出さない。値段を見せると遠慮が入ってしまい、
 * 「本当に欲しいもの」ではなく「安いもの」が選ばれてしまうため。
 */

/* タグの日本語ラベル。結果画面の「なぜこれ？」に使う */
const TAG_LABELS = {
  food: 'おいしいもの',
  sweets: '甘いもの好き',
  savory: 'しょっぱいもの派',
  fruit: '果物好き',
  tea: 'お茶好き',
  drink: '毎日の一杯',
  alcohol: 'お酒好き',
  consumable: 'なくなるものがいい',
  keepsake: 'ずっと残るもの',
  practical: '毎日つかえるもの',
  luxury: 'ちょっと贅沢に',
  appliance: '家電',
  kitchen: '台所しごと',
  cleaning: '掃除・洗濯',
  gadget: 'デジタルもの',
  tech_ok: '機械もへっちゃら',
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
  music: '音楽',
  movie: '映画・ドラマ',
  outing: 'お出かけ好き',
  active: 'アクティブ',
  hobby: '趣味の時間',
  garden: '花・園芸',
  craft: '手を動かすこと',
  book: '読書',
  learning: '新しいことを習う',
  photo: '写真',
  family: '家族',
  together: '誰かと一緒に',
  home: 'おうち時間',
  pet: '生きものの世話'
};

/* プレゼント候補 */
const GIFTS = [
  /* ── 食べもの・飲みもの ── */
  { id: 'sweets_set', emoji: '🍰', name: 'お取り寄せスイーツの詰め合わせ',
    note: '有名店のケーキやどら焼きを、冷凍便でおうちに。ひとつずつ食べる楽しみが続きます。',
    tags: ['food', 'sweets', 'consumable', 'home'] },

  { id: 'fruit', emoji: '🍑', name: '旬の高級フルーツ',
    note: 'シャインマスカット、桃、いちごなど。季節ごとに届く定期便にもできます。',
    tags: ['food', 'fruit', 'consumable', 'luxury'] },

  { id: 'gourmet', emoji: '🦀', name: 'ご当地グルメ・海鮮セット',
    note: 'かに、うなぎ、明太子、干物など。ちょっといい晩ごはんが何回か。',
    tags: ['food', 'savory', 'consumable'] },

  { id: 'tea_sub', emoji: '🍵', name: '日本茶の定期便',
    note: '毎月ちがう産地の茶葉が届きます。急須で淹れる時間ごと贈るようなものです。',
    tags: ['food', 'tea', 'drink', 'consumable', 'home'] },

  { id: 'coffee_beans', emoji: '☕', name: 'コーヒー豆の定期便',
    note: '焙煎したてが毎月。浅煎りから深煎りまで、好みを探す楽しみつき。',
    tags: ['food', 'drink', 'consumable', 'home'] },

  { id: 'sake', emoji: '🍶', name: '日本酒・ワインの飲みくらべセット',
    note: '小瓶が何本か入ったセットなら、飲みきりやすくて選ぶ楽しみも。',
    tags: ['food', 'alcohol', 'consumable'] },

  { id: 'rice', emoji: '🍚', name: 'おいしいお米の定期便',
    note: '毎日食べるものだからこそ効きます。銘柄を変えながら届けられます。',
    tags: ['food', 'savory', 'consumable', 'kitchen', 'practical'] },

  /* ── 家電・台所 ── */
  { id: 'coffee_maker', emoji: '⚡', name: '全自動コーヒーメーカー／上質な電気ケトル',
    note: 'ボタンひとつで挽きたての一杯。毎朝ちょっと嬉しくなる家電です。',
    tags: ['appliance', 'kitchen', 'drink', 'practical', 'tech_ok', 'home'] },

  { id: 'cook_pot', emoji: '🍲', name: '自動調理鍋・ホットプレート',
    note: '材料を入れてほっとくだけ。台所に立つ時間がぐっとラクになります。',
    tags: ['appliance', 'kitchen', 'practical', 'tech_ok'] },

  { id: 'robot_cleaner', emoji: '🤖', name: 'ロボット掃除機',
    note: '留守のあいだに掃除が終わっています。腰をかがめる回数が減ります。',
    tags: ['appliance', 'cleaning', 'practical', 'tech_ok'] },

  { id: 'futon_dryer', emoji: '🛏️', name: '布団乾燥機',
    note: '寝る前に30分でぽかぽかの布団に。梅雨どきも冬もうれしい一台。',
    tags: ['appliance', 'cleaning', 'sleep', 'warm', 'practical'] },

  { id: 'big_appliance', emoji: '🏠', name: '大きな家電の買い替え',
    note: '洗濯機や冷蔵庫など、古くなってきたものを一台。設置と処分まで手配します。',
    tags: ['appliance', 'practical', 'cleaning', 'kitchen', 'tech_ok', 'home'] },

  { id: 'humidifier', emoji: '💨', name: '加湿器・空気清浄機',
    note: '喉と肌のために。つけっぱなしでいいので、機械が苦手でも困りません。',
    tags: ['appliance', 'health', 'practical', 'home', 'tech_ok'] },

  { id: 'hot_carpet', emoji: '🔥', name: 'ホットカーペット・電気毛布',
    note: '足もとから温めるのがいちばん効きます。冬のあいだ毎日使うもの。',
    tags: ['appliance', 'warm', 'relax', 'home', 'sleep', 'practical'] },

  { id: 'knife', emoji: '🔪', name: 'よく切れる包丁とまな板',
    note: '研ぎ直しながら何十年も使えます。切れ味が変わると料理が軽くなります。',
    tags: ['kitchen', 'practical', 'keepsake', 'craft'] },

  { id: 'tableware', emoji: '🍵', name: '夫婦の器・湯呑み',
    note: '毎日の食卓に出てくるもの。名前を入れられる窯元もあります。',
    tags: ['kitchen', 'keepsake', 'home', 'together'] },

  /* ── 美容・くつろぎ ── */
  { id: 'hair_dryer', emoji: '💇', name: '高級ドライヤー',
    note: '自分ではなかなか買わないもの。乾かすだけで髪がつやっとします。',
    tags: ['beauty', 'appliance', 'luxury', 'practical'] },

  { id: 'massager', emoji: '💆', name: 'マッサージクッション／マッサージガン',
    note: 'テレビを見ながら肩や腰に。押すボタンはひとつだけのものが人気です。',
    tags: ['appliance', 'massage', 'relax', 'health', 'home'] },

  { id: 'skincare', emoji: '✨', name: 'スキンケア・化粧品のギフトセット',
    note: 'いつも使っているものより、ワンランク上のものを。',
    tags: ['beauty', 'luxury', 'consumable'] },

  { id: 'bath_gift', emoji: '🧴', name: '入浴剤・バスグッズの詰め合わせ',
    note: '毎晩ひとつずつ選ぶ楽しみ。香りのちがうものが入ったセットで。',
    tags: ['bath', 'relax', 'warm', 'consumable', 'home', 'beauty'] },

  { id: 'towel', emoji: '🛁', name: '今治タオル・バスローブのセット',
    note: '毎日ふれるものを、ちょっといいものに。何枚あっても困りません。',
    tags: ['towel', 'bath', 'relax', 'practical'] },

  { id: 'bedding', emoji: '😴', name: 'オーダー枕・羽毛布団などの寝具',
    note: '人生の1/3は寝ている時間。合う枕に変えると朝がちがいます。',
    tags: ['sleep', 'towel', 'relax', 'practical', 'warm'] },

  { id: 'cushion', emoji: '🪑', name: '座り心地のいい椅子・座椅子',
    note: '長く座る場所ほど体にこたえます。腰を支えてくれるものを。',
    tags: ['relax', 'home', 'health', 'practical', 'massage'] },

  /* ── 身につけるもの ── */
  { id: 'pajama', emoji: '🧸', name: '上質なパジャマ・ルームウェア',
    note: 'シルクやガーゼの肌ざわり。家にいる時間がいちばん長い服だからこそ。',
    tags: ['roomwear', 'fashion', 'relax', 'warm', 'sleep', 'home'] },

  { id: 'jewelry', emoji: '💍', name: '真珠・誕生石のアクセサリー',
    note: '60歳の節目に。法事やお祝いの席でずっと使えるものを選べます。',
    tags: ['accessory', 'fashion', 'keepsake', 'luxury'] },

  { id: 'stole', emoji: '🧣', name: '上質なストール・スカーフ',
    note: 'サイズを気にしなくていいのが利点。一枚あると肌寒い日に便利です。',
    tags: ['fashion', 'accessory', 'warm', 'keepsake'] },

  { id: 'shoes', emoji: '👟', name: '軽くて歩きやすい靴',
    note: '歩く時間が長い人ほど効きます。足に合うものを選べるギフト券も◎。',
    tags: ['shoes', 'fashion', 'active', 'practical', 'health', 'outing'] },

  { id: 'bag', emoji: '👜', name: '軽い本革のお出かけバッグ',
    note: '軽さがいちばん大事。旅行にもお出かけにも使えるサイズで。',
    tags: ['bag', 'fashion', 'active', 'outing', 'keepsake'] },

  /* ── 出かける・体験する ── */
  { id: 'onsen', emoji: '♨️', name: '温泉旅行・宿泊のギフト券',
    note: '日程は好きなときに選べます。お友だちや父と行ってもらっても。',
    tags: ['experience', 'travel', 'outing', 'luxury', 'relax'] },

  { id: 'restaurant', emoji: '🍽️', name: 'レストランのお食事券',
    note: '自分ではなかなか行かないお店へ。ふたり分にしておくと使いやすいです。',
    tags: ['experience', 'dining', 'outing', 'food', 'together'] },

  { id: 'ticket', emoji: '🎭', name: '舞台・美術展のチケット',
    note: '好きな演目を選んでもらえます。当日はごはんもセットにすると楽しい。',
    tags: ['experience', 'culture', 'outing', 'hobby'] },

  { id: 'concert', emoji: '🎻', name: 'コンサート・歌謡ショーのチケット',
    note: '好きな歌手やオーケストラを生で。会場の空気ごと贈るようなものです。',
    tags: ['experience', 'music', 'culture', 'outing'] },

  { id: 'cinema_ticket', emoji: '🎬', name: '映画館の鑑賞券（回数券）',
    note: '好きなときにふらっと行けます。ひとりでも誰とでも使えるのが利点。',
    tags: ['experience', 'movie', 'culture', 'outing'] },

  { id: 'lesson', emoji: '🏺', name: '陶芸・料理教室などの体験レッスン',
    note: '一日だけの体験なら気軽です。作ったものが手元に残るのもいいところ。',
    tags: ['experience', 'learning', 'hobby', 'outing', 'craft'] },

  { id: 'catalog', emoji: '🎁', name: '体験ギフトのカタログ',
    note: '陶芸、クルーズ、エステ…。冊子から自分で選べるので失敗がありません。',
    tags: ['experience', 'outing', 'hobby'] },

  /* ── 音楽・映像 ── */
  { id: 'music_player', emoji: '🔊', name: '音楽が聴けるスマートスピーカー',
    note: '「◯◯をかけて」と話しかけるだけ。昔の曲も探さずに出てきます。',
    tags: ['music', 'gadget', 'tech_ok', 'home', 'relax'] },

  { id: 'subscription_video', emoji: '📺', name: '動画配信サービスの視聴券',
    note: '昔の映画もドラマも見放題。設定はこちらで済ませてから渡せます。',
    tags: ['movie', 'home', 'consumable', 'relax', 'gadget'] },

  /* ── 趣味・学び ── */
  { id: 'flower_sub', emoji: '💐', name: '花の定期便・寄せ植えセット',
    note: '毎月お花が届きます。「今月のが届いたよ」と連絡する口実にもなります。',
    tags: ['garden', 'hobby', 'consumable', 'home', 'together'] },

  { id: 'garden_tools', emoji: '🪴', name: '園芸道具・プランターの一式',
    note: '軽くて手になじむ道具に変えるだけで、庭仕事がずいぶん楽になります。',
    tags: ['garden', 'hobby', 'practical', 'home', 'craft'] },

  { id: 'herb_kit', emoji: '🌿', name: 'ハーブ・家庭菜園のキット',
    note: '育てて、摘んで、その日の料理に。窓辺でも始められます。',
    tags: ['garden', 'hobby', 'kitchen', 'home', 'craft'] },

  { id: 'craft_kit', emoji: '🧶', name: '手芸・編みもののキット',
    note: 'おうち時間のおともに。できあがったら送ってもらう約束つきで。',
    tags: ['craft', 'hobby', 'home'] },

  { id: 'books', emoji: '📚', name: '好きな作家の本・全集',
    note: '読みたかったものをまとめて。装丁のいいものは本棚に残ります。',
    tags: ['book', 'hobby', 'home', 'keepsake'] },

  { id: 'letter_set', emoji: '✒️', name: '上質な便箋と万年筆',
    note: '手紙を書く人へ。書き味のいいペンは、書くこと自体を楽しくします。',
    tags: ['keepsake', 'craft', 'family', 'home', 'book'] },

  { id: 'online_course', emoji: '🎓', name: 'カルチャー教室・通信講座',
    note: '書道、俳句、英会話など。同じ趣味の人と知り合うきっかけにも。',
    tags: ['learning', 'hobby', 'home', 'culture'] },

  /* ── 家族・つながり ── */
  { id: 'photo_frame', emoji: '🖼️', name: 'デジタルフォトフレーム',
    note: '離れていても、こちらから写真を送ると自動で表示されます。設定は息子が。',
    tags: ['photo', 'family', 'together', 'gadget', 'tech_ok', 'keepsake', 'home'] },

  { id: 'photo_book', emoji: '📖', name: '家族写真のフォトブックと手紙',
    note: '昔の写真と最近の写真をまとめて一冊に。何度でも見返せます。',
    tags: ['photo', 'family', 'together', 'keepsake', 'home'] },

  { id: 'tablet', emoji: '📱', name: 'ビデオ通話用のタブレット',
    note: '大きい画面で顔を見ながら話せます。初期設定を済ませてから送ります。',
    tags: ['gadget', 'tech_ok', 'family', 'together', 'practical'] },

  { id: 'trip_together', emoji: '🚅', name: '一緒に行く旅行（息子が帰省して小旅行）',
    note: 'いちばんの贈りものは時間かもしれません。日程だけ先に押さえます。',
    tags: ['together', 'family', 'experience', 'travel', 'outing'] },

  /* ── 体をいたわる ── */
  { id: 'walking_pole', emoji: '🚶', name: 'ウォーキング用品一式',
    note: '軽いポールや歩きやすい上着。散歩が習慣になっている人へ。',
    tags: ['active', 'health', 'outing', 'shoes', 'practical'] },

  { id: 'yoga', emoji: '🧘', name: 'ヨガ・ストレッチの道具',
    note: 'マットとローラーがあれば、テレビを見ながらでも体をほぐせます。',
    tags: ['health', 'active', 'home', 'relax', 'massage'] },

  { id: 'pet_goods', emoji: '🐕', name: 'ペットのためのもの',
    note: '本人にではなく、かわいがっている相手に。いちばん喜ばれることもあります。',
    tags: ['pet', 'home', 'practical', 'together'] }
];

/*
 * 質問。tags の値がプラスなら「そのタグを持つプレゼントの点が上がる」、
 * マイナスなら下がる。3〜4 で強い影響、1〜2 でゆるい影響。
 * 値段に関する質問は置かない。
 */
const QUESTIONS = [
  { id: 'q_style', text: '誕生日は、どんなふうに過ごせたら嬉しいですか？',
    choices: [
      { emoji: '🏠', label: 'おうちでゆっくり', tags: { home: 3, relax: 2, outing: -2, experience: -2 } },
      { emoji: '🚶', label: 'どこかへ出かけたい', tags: { outing: 3, experience: 3, active: 2, home: -1 } },
      { emoji: '👨‍👩‍👦', label: '家族と話したり会ったり', tags: { family: 3, together: 3, photo: 2 } },
      { emoji: '🎐', label: 'とくにこだわりません', escape: true, tags: {} }
    ] },

  { id: 'q_form', text: 'プレゼント、どっちが好みですか？',
    choices: [
      { emoji: '🎀', label: 'ずっと残るもの', tags: { keepsake: 3, consumable: -3, practical: 1 } },
      { emoji: '🍽️', label: '食べたり使ったりしてなくなるもの', tags: { consumable: 3, food: 2, keepsake: -3 } },
      { emoji: '🤔', label: 'どちらでも嬉しい', escape: true, tags: { practical: 1, experience: 1 } }
    ] },

  { id: 'q_want', text: '最近「これ欲しいなあ」と思ったのは、どれに近いですか？',
    choices: [
      { emoji: '🧹', label: '家のことがラクになるもの', tags: { appliance: 3, practical: 3, cleaning: 2, kitchen: 2 } },
      { emoji: '🛀', label: '自分を甘やかすもの', tags: { luxury: 3, relax: 3, beauty: 2, bath: 2 } },
      { emoji: '🎨', label: '楽しみ・趣味のもの', tags: { hobby: 3, culture: 2, craft: 2, garden: 2 } },
      { emoji: '🤷', label: 'とくに思いつきません', escape: true, tags: {} }
    ] },

  { id: 'q_taste', text: '食べものなら、どれがいちばん嬉しいですか？',
    choices: [
      { emoji: '🍡', label: '甘いもの', tags: { sweets: 4, food: 2 } },
      { emoji: '🍢', label: 'しょっぱいもの・お酒', tags: { savory: 3, alcohol: 3, food: 2, sweets: -2 } },
      { emoji: '🍇', label: '果物やお茶', tags: { fruit: 3, tea: 3, drink: 2, food: 2 } },
      { emoji: '🍽️', label: '食べものはあまり要りません', escape: true, tags: { food: -3, consumable: -2 } }
    ] },

  { id: 'q_morning', text: '朝いちばんに飲むものは？',
    choices: [
      { emoji: '☕', label: 'コーヒー', tags: { drink: 4, appliance: 1 } },
      { emoji: '🍵', label: '日本茶', tags: { tea: 4, drink: 2, home: 1 } },
      { emoji: '💧', label: '白湯やお水', tags: { health: 3, drink: -1 } },
      { emoji: '🥛', label: 'そのほか（紅茶や牛乳など）', escape: true, tags: { drink: 2 } }
    ] },

  { id: 'q_tech', text: '新しい家電やデジタルものは、どうですか？',
    choices: [
      { emoji: '👍', label: '便利なら使ってみたい', tags: { tech_ok: 3, appliance: 2, gadget: 2 } },
      { emoji: '🙂', label: 'ふつうに使えます', escape: true, tags: { tech_ok: 1 } },
      { emoji: '😅', label: '説明書を読むのは苦手', tags: { tech_ok: -3, gadget: -3, appliance: -2 } }
    ] },

  { id: 'q_body', text: 'からだのことで、いちばん気になるのは？',
    choices: [
      { emoji: '💆', label: '肩や腰がつらい', tags: { massage: 4, relax: 2, health: 3 } },
      { emoji: '🧦', label: '冷えが気になる', tags: { warm: 4, bath: 2, roomwear: 2 } },
      { emoji: '🌙', label: 'ぐっすり眠りたい', tags: { sleep: 4, relax: 2 } },
      { emoji: '💪', label: 'とくに元気です', escape: true, tags: { active: 2, outing: 1, health: -1 } }
    ] },

  { id: 'q_outing', text: 'お出かけするなら、どれがいちばん楽しみ？',
    choices: [
      { emoji: '♨️', label: '温泉でのんびり', tags: { travel: 4, experience: 2, relax: 2 } },
      { emoji: '🍷', label: 'おいしいごはん', tags: { dining: 4, experience: 2, food: 2 } },
      { emoji: '🎼', label: '舞台・美術館・コンサート', tags: { culture: 4, experience: 2, music: 2 } },
      { emoji: '🛍️', label: 'そのほか（買い物や自然など）', escape: true, tags: { outing: 2, experience: 1 } }
    ] },

  { id: 'q_home', text: 'おうちにいる時間、何をしていることが多いですか？',
    choices: [
      { emoji: '📺', label: 'テレビや映画を見る', tags: { movie: 4, home: 2, relax: 2 } },
      { emoji: '🌱', label: '庭いじり・お花の世話', tags: { garden: 4, hobby: 2 } },
      { emoji: '🧵', label: '手芸や読書', tags: { craft: 3, book: 3, hobby: 2 } },
      { emoji: '🍳', label: '料理やお菓子づくり', tags: { kitchen: 4, appliance: 2 } },
      { emoji: '🌀', label: 'そのほか', escape: true, tags: {} }
    ] },

  { id: 'q_music', text: '音楽を聴くのは好きですか？',
    choices: [
      { emoji: '🎵', label: '好き。よく聴きます', tags: { music: 4, culture: 2, relax: 1 } },
      { emoji: '🔇', label: 'あまり聴かないほう', tags: { music: -3 } }
    ] },

  { id: 'q_movie', text: '映画やドラマは、どうですか？',
    choices: [
      { emoji: '🍿', label: '見はじめると止まらない', tags: { movie: 4, home: 2, relax: 1 } },
      { emoji: '🙂', label: 'そんなに見ないかな', tags: { movie: -3 } }
    ] },

  { id: 'q_learn', text: '新しいことを習ってみたい気持ちはありますか？',
    choices: [
      { emoji: '📖', label: 'あります。やってみたい', tags: { learning: 4, hobby: 2, culture: 2, experience: 1 } },
      { emoji: '🍵', label: '今のままでじゅうぶん', tags: { learning: -3, relax: 2, home: 1 } }
    ] },

  { id: 'q_hands', text: '手を動かして何かを作るのは好きですか？',
    choices: [
      { emoji: '✂️', label: '好き。作っているときが楽しい', tags: { craft: 4, hobby: 2, garden: 1, kitchen: 1 } },
      { emoji: '😌', label: '見ているほうが好き', tags: { craft: -3, relax: 2 } }
    ] },

  { id: 'q_pet', text: '生きものや植物の世話をしていますか？',
    choices: [
      { emoji: '🐈', label: 'ペットがいます', tags: { pet: 4, together: 2, home: 1 } },
      { emoji: '🪴', label: '植物なら育てています', tags: { garden: 3, home: 1, pet: -1 } },
      { emoji: '🚫', label: 'どちらもいません', escape: true, tags: { pet: -3, garden: -2 } }
    ] },

  { id: 'q_cook', text: '料理をするのは、どちらかというと…',
    choices: [
      { emoji: '😊', label: '好き。作るのが楽しい', tags: { kitchen: 4, craft: 1 } },
      { emoji: '😮‍💨', label: '毎日のことなので、正直めんどう', tags: { appliance: 3, practical: 3, dining: 2, kitchen: -1 } }
    ] },

  { id: 'q_wear', text: '服やアクセサリーを贈られるのは、どうですか？',
    choices: [
      { emoji: '🙅', label: 'サイズも好みもあるので自分で選びたい', tags: { fashion: -3, accessory: -2, shoes: -2, bag: -2 } },
      { emoji: '💝', label: 'もらえたら嬉しい', tags: { fashion: 3, accessory: 3, keepsake: 2 } },
      { emoji: '🧸', label: 'パジャマや部屋着ならぜひ', tags: { roomwear: 4, home: 2, fashion: 1 } },
      { emoji: '🤷', label: 'とくにこだわりません', escape: true, tags: {} }
    ] },

  { id: 'q_honne', text: 'ここだけの話。どれかひとつ選べるとしたら、本当は？',
    sub: '遠慮しなくて大丈夫です。正直なところを押してください。',
    choices: [
      { emoji: '🍩', label: 'やっぱり食べものが一番うれしい', tags: { food: 3, consumable: 3, sweets: 1 } },
      { emoji: '🏆', label: 'ずっと使えるものが欲しい', tags: { keepsake: 3, luxury: 2, practical: 1 } },
      { emoji: '🌅', label: '思い出に残ることがしたい', tags: { experience: 4, together: 2, travel: 2 } },
      { emoji: '🤔', label: 'ひとつには決められません', escape: true, tags: {} }
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

  { id: 'q_friends', text: 'お友だちと出かけることは多いですか？',
    choices: [
      { emoji: '👯', label: 'よく出かけます', tags: { outing: 3, dining: 2, together: 2, culture: 1 } },
      { emoji: '🏡', label: '家にいることが多いです', tags: { home: 3, outing: -2 } }
    ] },

  { id: 'q_replace', text: '毎日使うもので、そろそろ買い替えたいものはありますか？',
    choices: [
      { emoji: '🔪', label: '台所まわり', tags: { kitchen: 3, appliance: 3, practical: 2 } },
      { emoji: '🧺', label: '掃除・洗濯まわり', tags: { cleaning: 4, appliance: 3, practical: 2 } },
      { emoji: '🛌', label: 'タオルや寝具', tags: { towel: 4, sleep: 3, practical: 2 } },
      { emoji: '🔧', label: 'そのほかに何かある', escape: true, tags: { practical: 2 } },
      { emoji: '🆗', label: 'とくにない', tags: { practical: -2, luxury: 2, experience: 1 } }
    ] },

  { id: 'q_sit', text: '家で座っている時間は長いほうですか？',
    choices: [
      { emoji: '🪑', label: '長いです。同じ場所によくいます', tags: { relax: 3, home: 2, massage: 2, health: 1 } },
      { emoji: '🏃', label: 'わりと動きまわっています', tags: { active: 3, health: 1, relax: -1 } }
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
    ] },

  { id: 'q_contact', text: '遠くの家族とやりとりするなら、どちらが好きですか？',
    choices: [
      { emoji: '✉️', label: '手紙やはがき', tags: { keepsake: 3, family: 2, craft: 2, book: 1 } },
      { emoji: '📞', label: '電話・ビデオ通話・LINE', tags: { gadget: 3, together: 3, family: 2, tech_ok: 2 } },
      { emoji: '🤷', label: 'どちらでもいい', escape: true, tags: {} }
    ] }
];

/*
 * 深掘り（第2段階）
 *
 * 候補を1つ選んでもらったあと、その品についてだけ1〜2問たずねて、
 * 「果物」ではなく「桃」、「大きな家電」ではなく「洗濯機」まで絞りこむ。
 *
 * choices の各項目は、次のどちらか:
 *   - name と note を持つ … そこで確定
 *   - next を持つ         … さらにもう一段たずねる
 *
 * 書いていない品は深掘りなしで、選んだ時点で終わります。
 */
const REFINEMENTS = {
  /* ── 食べもの・飲みもの ── */
  sweets_set: { question: 'お菓子なら、どれがいちばん？', choices: [
    { emoji: '🍰', label: '洋菓子', name: '洋菓子の詰め合わせ', note: '有名店の焼き菓子とケーキ。日持ちするものを中心に。' },
    { emoji: '🍡', label: '和菓子', name: '和菓子の詰め合わせ', note: '老舗のどら焼きや羊羹。お茶うけにちょうどいいものを。' },
    { emoji: '🍫', label: 'チョコレート', name: '専門店のチョコレート', note: 'ひと粒ずつ味のちがうボンボンショコラの箱。' },
    { emoji: '🍮', label: 'プリンやゼリー', name: '冷やして食べる生菓子', note: 'プリンやフルーツゼリーの詰め合わせ。冷蔵便で。' }
  ]},

  fruit: { question: '果物なら、どれがいちばん好きですか？', choices: [
    { emoji: '🍑', label: '桃', next: { question: '桃は、どちらが好みですか？', choices: [
      { emoji: '🤍', label: 'やわらかい白桃', name: '旬のやわらかい白桃', note: '食べごろを見計らって産地から直送してもらいます。' },
      { emoji: '💛', label: 'かたい黄桃・ネクタリン', name: '黄桃・ネクタリンの詰め合わせ', note: 'こりっとした食感のもの。日持ちもします。' }
    ]}},
    { emoji: '🍇', label: 'ぶどう', name: 'シャインマスカット', note: '皮ごと食べられる大粒のもの。種もありません。' },
    { emoji: '🍓', label: 'いちご', name: 'ブランドいちごの詰め合わせ', note: 'あまおうや紅ほっぺなど、粒の大きいものを冬に。' },
    { emoji: '🍊', label: 'りんごや柑橘', name: 'りんご・柑橘の詰め合わせ', note: '日持ちするので、少しずつ食べられます。' }
  ]},

  gourmet: { question: 'どれがいちばん食べたいですか？', choices: [
    { emoji: '🦀', label: 'かに・海鮮', name: 'かに・海鮮の詰め合わせ', note: 'かにやほたてなど。鍋にもそのままにも。' },
    { emoji: '🍱', label: 'うなぎ', name: 'うなぎの蒲焼き', note: '温めるだけで食べられるもの。何食かに分けられます。' },
    { emoji: '🥩', label: 'お肉', name: 'ブランド牛のすき焼き・ステーキ用', note: '少量でも満足できる、いい部位のものを。' },
    { emoji: '🐟', label: '干物・練り物', name: '干物・練り物の詰め合わせ', note: '毎日の食卓に出せるもの。冷凍で長く置けます。' }
  ]},

  tea_sub: { question: 'お茶は、どれがお好きですか？', choices: [
    { emoji: '🍵', label: '煎茶', name: '煎茶の定期便', note: '産地ちがいの煎茶が毎月。飲みくらべができます。' },
    { emoji: '🌿', label: '玉露・抹茶', name: '玉露・抹茶の定期便', note: 'ゆっくり淹れて味わうお茶。茶器とあわせても。' },
    { emoji: '🫖', label: 'ほうじ茶・番茶', name: 'ほうじ茶・番茶の定期便', note: '香ばしくて、夜でも飲みやすいもの。' },
    { emoji: '☕', label: '紅茶', name: '紅茶の定期便', note: '茶葉とティーバッグを混ぜて。お菓子と合わせて。' }
  ]},

  coffee_beans: { question: 'コーヒーは、どんなのが好みですか？', choices: [
    { emoji: '🌤️', label: 'すっきり（浅煎り）', name: '浅煎りコーヒー豆の定期便', note: '酸味のある明るい味。豆の説明をつけて送ります。' },
    { emoji: '🌑', label: 'こっくり（深煎り）', name: '深煎りコーヒー豆の定期便', note: '苦みとコクのあるもの。牛乳ともよく合います。' },
    { emoji: '🌙', label: 'カフェインの少ないもの', name: 'カフェインレスコーヒーの定期便', note: '夜でも飲めるもの。味はしっかりしています。' },
    { emoji: '📦', label: '手軽なドリップバッグ', name: 'ドリップバッグの詰め合わせ', note: 'お湯を注ぐだけ。器具がいりません。' }
  ]},

  sake: { question: 'お酒は、どれがお好きですか？', choices: [
    { emoji: '🍶', label: '日本酒', name: '日本酒の飲みくらべセット', note: '小瓶が数本。冷やでも燗でも。' },
    { emoji: '🍷', label: 'ワイン', name: 'ワインの飲みくらべセット', note: 'ハーフボトルを何本か。飲みきりやすい量で。' },
    { emoji: '🥃', label: '焼酎', name: '焼酎の飲みくらべセット', note: '芋・麦・米を少しずつ。' },
    { emoji: '🍑', label: '梅酒や果実酒', name: '梅酒・果実酒の詰め合わせ', note: '甘くて飲みやすいもの。食後に少しずつ。' }
  ]},

  rice: { question: 'お米は、どんなのがお好きですか？', choices: [
    { emoji: '✨', label: 'つやつやで甘いもの', name: 'つや姫・ゆめぴりかの定期便', note: '粒が立って甘みのある銘柄を毎月。' },
    { emoji: '🍚', label: 'あっさりした定番', name: 'コシヒカリ・ななつぼしの定期便', note: 'おかずを選ばない、食べ飽きない味。' },
    { emoji: '🌾', label: '玄米や雑穀', name: '玄米・雑穀米の定期便', note: '体を気づかう人へ。食べやすく精米したものも。' },
    { emoji: '🎁', label: '食べくらべたい', name: 'お米の食べくらべセット', note: '少量パックで何種類も。当たりを探せます。' }
  ]},

  /* ── 家電・台所 ── */
  big_appliance: { question: '大きな家電なら、どれが助かりますか？', choices: [
    { emoji: '🧺', label: '洗濯機', next: { question: '洗濯機は、どちらがいいですか？', choices: [
      { emoji: '🌀', label: '今と同じ縦型', name: '縦型洗濯機', note: '使い方が変わらないので迷いません。静かなものを選びます。' },
      { emoji: '♨️', label: '乾燥までできるドラム式', name: 'ドラム式洗濯乾燥機', note: '干す手間が減ります。設置できるか先に確認します。' }
    ]}},
    { emoji: '🧊', label: '冷蔵庫', next: { question: '冷蔵庫で気になるのは？', choices: [
      { emoji: '📏', label: 'もっと入る大きさ', name: '大容量の冷蔵庫', note: 'まとめ買いしても入るもの。搬入経路を確認します。' },
      { emoji: '🤫', label: '静かさ・省エネ', name: '静音・省エネの冷蔵庫', note: '夜も気にならないもの。電気代も下がります。' }
    ]}},
    { emoji: '❄️', label: 'エアコン', name: 'エアコンの買い替え', note: '工事も含めて手配します。夏と冬の効きが変わります。' },
    { emoji: '📺', label: 'テレビ', name: '大きな画面のテレビ', note: '見やすい大きさのもの。配線と設定まで済ませます。' }
  ]},

  coffee_maker: { question: '台所に置くなら、どれがいいですか？', choices: [
    { emoji: '⚙️', label: '豆から挽けるもの', name: 'ミル付き全自動コーヒーメーカー', note: '豆を入れてボタンひとつ。挽きたてが飲めます。' },
    { emoji: '🫖', label: '上質な電気ケトル', name: '温度調節つき電気ケトル', note: 'お茶の種類に合わせた温度で沸かせます。' },
    { emoji: '☕', label: 'エスプレッソマシン', name: 'カプセル式エスプレッソマシン', note: 'カプセルを入れるだけ。片づけも簡単です。' },
    { emoji: '💧', label: '手で淹れる道具一式', name: 'ドリップ用の道具とミル', note: '淹れる時間そのものを楽しむ人へ。' }
  ]},

  cook_pot: { question: '台所で、いちばん助かるのは？', choices: [
    { emoji: '🍲', label: '材料を入れて待つだけの鍋', name: '自動調理鍋', note: '煮込みもカレーもほったらかしで作れます。' },
    { emoji: '🥘', label: 'みんなで囲めるホットプレート', name: 'ホットプレート', note: '焼き肉もお好み焼きも。人が集まる日に。' },
    { emoji: '🍚', label: 'ごはんがおいしく炊けるもの', name: '高性能な炊飯器', note: '毎日食べるものなので、いちばん効きます。' },
    { emoji: '🍞', label: 'パンや朝ごはんのもの', name: 'トースター・オーブン', note: '外はさくっと、中はふわっと焼けるもの。' }
  ]},

  robot_cleaner: { question: '掃除で、いちばん面倒なのは？', choices: [
    { emoji: '🤖', label: '掃除機をかけること自体', name: '自動で動くロボット掃除機', note: '留守のあいだに終わっています。段差にも強いものを。' },
    { emoji: '🪶', label: '掃除機が重いこと', name: '軽いスティック掃除機', note: '片手で持てる軽さ。さっと出してさっとかけられます。' },
    { emoji: '🧽', label: '床の拭き掃除', name: '水拭きもできる掃除機', note: 'かけながら拭けるので、二度手間がなくなります。' },
    { emoji: '🪟', label: '窓や高いところ', name: '窓・高所用の掃除道具一式', note: '脚立に乗らずに届くもの。危なくありません。' }
  ]},

  futon_dryer: { question: '干すことで困っているのは？', choices: [
    { emoji: '🛏️', label: '布団が干せない', name: 'マット不要の布団乾燥機', note: 'ノズルを差しこむだけ。寝る前の30分でぽかぽかに。' },
    { emoji: '👕', label: '洗濯物が乾かない', name: '衣類乾燥除湿機', note: '部屋干しでも生乾きになりません。梅雨どきに。' },
    { emoji: '🧹', label: '布団のほこり', name: 'ふとん専用の掃除機', note: 'たたいて吸うタイプ。ダニ対策にも。' }
  ]},

  humidifier: { question: '空気のことで気になるのは？', choices: [
    { emoji: '💧', label: '乾燥', name: '加湿器', note: '喉と肌のために。手入れが簡単なものを選びます。' },
    { emoji: '🌫️', label: 'ほこりや花粉', name: '空気清浄機', note: 'つけっぱなしでいいので、機械が苦手でも困りません。' },
    { emoji: '🔄', label: '両方', name: '加湿空気清浄機', note: '一台で済むので置き場所を取りません。' }
  ]},

  hot_carpet: { question: 'どこが寒いですか？', choices: [
    { emoji: '🛏️', label: '寝るとき', name: '電気毛布・敷きパッド', note: '寝る前に温めておけます。タイマーつきで。' },
    { emoji: '🦶', label: '足もと', name: '足元ヒーター・電気あんか', note: '座っているあいだの足先を温めます。' },
    { emoji: '🏠', label: '部屋そのもの', name: 'ホットカーペット', note: '床から温まるので、部屋全体がやわらかくなります。' },
    { emoji: '🍊', label: 'こたつが欲しい', name: 'こたつ・こたつ布団', note: '一度入ると出られないやつです。' }
  ]},

  knife: { question: '台所の道具なら、どれを新しくしたいですか？', choices: [
    { emoji: '🔪', label: '包丁', name: 'よく切れる包丁', note: '研ぎ直しながら何十年も使えるもの。' },
    { emoji: '🪵', label: 'まな板', name: '軽くて清潔なまな板', note: '洗いやすく、乾きやすいもの。' },
    { emoji: '🍳', label: '鍋やフライパン', name: '軽い鍋・フライパン', note: '重い鍋は手首にこたえるので、軽いものを。' },
    { emoji: '🫙', label: '保存容器', name: '保存容器のセット', note: 'そのまま温められて、重ねて置けるもの。' }
  ]},

  tableware: { question: '器なら、どれがいいですか？', choices: [
    { emoji: '🍵', label: '湯呑み・湯呑みセット', name: '夫婦湯呑み', note: '名前を入れられる窯元もあります。' },
    { emoji: '🍚', label: 'ごはん茶碗', name: '夫婦茶碗', note: '毎日手に取るもの。軽さで選びます。' },
    { emoji: '🍽️', label: '取り皿や大皿', name: '普段づかいの器のセット', note: '食洗機に入れられるものを選びます。' },
    { emoji: '🥢', label: 'お箸やカトラリー', name: '塗りの箸・カトラリーのセット', note: '名入れができます。来客用にも。' }
  ]},

  /* ── 美容・くつろぎ ── */
  hair_dryer: { question: '美容の道具なら、どれが嬉しいですか？', choices: [
    { emoji: '💨', label: 'ドライヤー', name: '速乾・低温の高級ドライヤー', note: '短時間で乾いて、髪が傷みません。軽いものを。' },
    { emoji: '💇', label: 'ヘアアイロン・カーラー', name: 'ヘアアイロン・ホットカーラー', note: '朝の支度が早くなります。' },
    { emoji: '✨', label: '顔のお手入れの機械', name: '美顔器', note: 'テレビを見ながら使えるもの。' },
    { emoji: '🦷', label: '電動歯ブラシ', name: '電動歯ブラシ', note: '歯ぐきにやさしいモードがあるもの。' }
  ]},

  massager: { question: 'どこがいちばんつらいですか？', choices: [
    { emoji: '🫸', label: '肩・首', name: '肩用マッサージクッション', note: '椅子に置いて、もたれるだけ。' },
    { emoji: '🦵', label: '腰・脚', name: 'マッサージガン', note: '当てたいところにピンポイントで。軽いものを。' },
    { emoji: '🦶', label: '足・ふくらはぎ', name: 'フットマッサージャー', note: '足を入れるだけ。むくみが取れます。' },
    { emoji: '👁️', label: '目の疲れ', name: 'ホットアイマスク・目元ケア', note: '寝る前の数分で、翌朝がちがいます。' }
  ]},

  skincare: { question: 'お手入れで気になるのは？', choices: [
    { emoji: '💧', label: '乾燥', name: '保湿の化粧水・乳液セット', note: 'いつものより、ワンランク上のものを。' },
    { emoji: '✨', label: 'はりやしわ', name: 'エイジングケアの美容液', note: '夜つけるタイプ。少量で長く使えます。' },
    { emoji: '☀️', label: '日焼け', name: '日焼け止め・UVケアのセット', note: '毎日使うものなので、使い心地のいいものを。' },
    { emoji: '🤲', label: '手あれ', name: 'ハンドクリーム・ネイルケア', note: '水仕事のあとに。香りちがいを何本か。' }
  ]},

  bath_gift: { question: 'お風呂のものなら、どれがいいですか？', choices: [
    { emoji: '🛁', label: '入浴剤', name: '入浴剤の詰め合わせ', note: '毎晩ひとつずつ選ぶ楽しみ。香りちがいで。' },
    { emoji: '🧂', label: 'バスソルト・温泉のもと', name: '温泉のもと・バスソルト', note: '家で温泉気分。体の芯から温まります。' },
    { emoji: '🧴', label: 'シャンプーや石けん', name: '上質なシャンプー・ボディソープ', note: '毎日使うものを、ちょっといいものに。' },
    { emoji: '🪮', label: 'お風呂の道具', name: 'バスグッズ一式', note: '湯上がりタオルやブラシなど、そろえて。' }
  ]},

  towel: { question: 'タオルなら、どれがいちばん使いますか？', choices: [
    { emoji: '🛁', label: 'バスタオル', name: '今治のバスタオル', note: '厚手でふわっとしたもの。何枚あっても困りません。' },
    { emoji: '🧻', label: 'フェイスタオル', name: '今治のフェイスタオルセット', note: '毎日使うぶん、多めに。' },
    { emoji: '🥋', label: 'バスローブ', name: 'バスローブ', note: '湯上がりにさっと羽織れるもの。' },
    { emoji: '🛌', label: 'ガーゼケット・肌掛け', name: 'ガーゼケット', note: '夏でも冬でも使える、軽い掛けもの。' }
  ]},

  bedding: { question: '寝具なら、どれを変えたいですか？', choices: [
    { emoji: '🛏️', label: '枕', name: 'オーダー枕', note: '高さを測って作るもの。合うと朝がちがいます。' },
    { emoji: '☁️', label: '掛け布団', name: '羽毛布団', note: '軽くて温かいもの。打ち直しもできます。' },
    { emoji: '🧱', label: '敷きふとん・マットレス', name: '高反発マットレス・敷きパッド', note: '腰が沈まないもの。寝返りが楽になります。' },
    { emoji: '🧣', label: '毛布', name: '上質な毛布', note: '肌ざわりのいいもの。洗えるタイプで。' }
  ]},

  cushion: { question: '座るものなら、どれがいいですか？', choices: [
    { emoji: '🪑', label: '座椅子', name: '背もたれつきの座椅子', note: '腰を支えてくれるもの。角度が変えられます。' },
    { emoji: '🛋️', label: 'クッション', name: '姿勢を支えるクッション', note: '今の椅子にのせるだけ。腰がまっすぐになります。' },
    { emoji: '💺', label: 'しっかりした椅子', name: '肘掛けつきの椅子', note: '立ち座りが楽なもの。高さも選べます。' },
    { emoji: '🦶', label: '足を上げるもの', name: 'フットレスト・オットマン', note: '足を上げるとむくみが引きます。' }
  ]},

  /* ── 身につけるもの ── */
  pajama: { question: 'おうちで着るなら、どれがいいですか？', choices: [
    { emoji: '🌙', label: 'パジャマ', name: '上質なパジャマ', note: 'シルクやガーゼ。肌ざわりで選びます。' },
    { emoji: '🧥', label: 'はおるもの', name: 'カーディガン・はんてん', note: 'さっと羽織れるもの。洗えるタイプで。' },
    { emoji: '🧦', label: '足まわり', name: '靴下・レッグウォーマー', note: '締めつけないもの。足先の冷えに効きます。' },
    { emoji: '👘', label: 'ガウン・部屋着', name: 'ルームウェア一式', note: '来客があっても困らない、きちんと見えるもの。' }
  ]},

  jewelry: { question: 'アクセサリーなら、どれがいいですか？', choices: [
    { emoji: '📿', label: 'ネックレス', name: '真珠のネックレス', note: 'お祝いの席にも法事にも使えるもの。' },
    { emoji: '💍', label: '指輪', name: '誕生石の指輪', note: 'サイズを測ってから作ります。' },
    { emoji: '👂', label: 'イヤリング・ピアス', name: '誕生石のイヤリング', note: '痛くならない留め具のものを選びます。' },
    { emoji: '🎀', label: 'ブローチ', name: 'ブローチ', note: '服を選ばず使えます。着物にも合います。' }
  ]},

  stole: { question: '首まわりのものなら、どれがいいですか？', choices: [
    { emoji: '🧣', label: 'ストール', name: '上質なストール', note: '一枚あると肌寒い日に便利。大判のものを。' },
    { emoji: '🎀', label: 'スカーフ', name: 'シルクのスカーフ', note: '巻き方で雰囲気が変わります。明るい色を。' },
    { emoji: '❄️', label: '冬のマフラー', name: 'カシミヤのマフラー', note: '軽くて暖かいもの。長く使えます。' },
    { emoji: '👒', label: '帽子', name: '帽子', note: '日よけにも防寒にも。折りたためるものを。' }
  ]},

  shoes: { question: '靴なら、どれがいちばん要りますか？', choices: [
    { emoji: '👟', label: '歩きやすいスニーカー', name: 'ウォーキングシューズ', note: '軽くて脱ぎ履きしやすいもの。' },
    { emoji: '👠', label: 'きちんとした靴', name: '歩ける革靴・パンプス', note: 'お出かけ用でも痛くならないもの。' },
    { emoji: '🩴', label: '夏のサンダル', name: 'サンダル', note: '足を支えてくれる、疲れにくいもの。' },
    { emoji: '🥿', label: '室内履き', name: 'ルームシューズ', note: '床が冷たい家に。滑らないものを。' }
  ]},

  bag: { question: 'バッグなら、どんなのが使いやすいですか？', choices: [
    { emoji: '👜', label: '手提げ・トート', name: '軽い本革のトートバッグ', note: 'A4が入る大きさ。とにかく軽いものを。' },
    { emoji: '👝', label: '肩掛け', name: 'ショルダーバッグ', note: '手があくので、買い物のときに楽です。' },
    { emoji: '🎒', label: 'リュック', name: '上品に見えるリュック', note: '両手があいて、肩もこりません。' },
    { emoji: '💳', label: 'お財布や小物', name: '財布・小物入れ', note: '小銭が取り出しやすいもの。名入れもできます。' }
  ]},

  /* ── 出かける・体験する ── */
  onsen: { question: '温泉なら、どんなところがいいですか？', choices: [
    { emoji: '🚗', label: '近場でさっと', name: '近場の温泉宿の宿泊券', note: '日程を選ばず、思い立ったら行けます。' },
    { emoji: '🚄', label: '遠くの有名なところ', name: '有名温泉地の宿泊券', note: '一度は行ってみたい宿を選べます。' },
    { emoji: '🌊', label: '景色のいいところ', name: '海や山が見える宿の宿泊券', note: '部屋から景色が見える宿を中心に。' },
    { emoji: '🎫', label: '自分で選びたい', name: '宿泊ギフト券（宿を選べるもの）', note: '冊子やサイトから好きな宿を選べます。' }
  ]},

  restaurant: { question: '食べに行くなら、どれがいいですか？', choices: [
    { emoji: '🍣', label: '和食', name: '日本料理・お寿司のお食事券', note: '個室のあるお店を選びます。' },
    { emoji: '🥩', label: '洋食', name: 'フレンチ・イタリアンのお食事券', note: '記念日らしいコースのあるお店で。' },
    { emoji: '🥟', label: '中華', name: '中華料理のお食事券', note: '取り分けて食べられるので人数を選びません。' },
    { emoji: '🏨', label: 'ホテルで', name: 'ホテルのランチ・アフタヌーンティー券', note: '昼なら気楽です。景色のいいところを。' }
  ]},

  ticket: { question: '観るなら、どれがいちばん楽しみですか？', choices: [
    { emoji: '🎎', label: '歌舞伎・演劇', name: '歌舞伎・演劇のチケット', note: '演目を選んでもらえます。' },
    { emoji: '🖼️', label: '美術展', name: '美術展のチケット', note: '会期の長いものなら、ゆっくり行けます。' },
    { emoji: '🎤', label: '落語・寄席', name: '落語・寄席のチケット', note: '気楽に笑えます。近くの寄席でも。' },
    { emoji: '🎭', label: 'ミュージカル', name: 'ミュージカルのチケット', note: '華やかな演目を。' }
  ]},

  concert: { question: '音楽なら、どれを聴きたいですか？', choices: [
    { emoji: '🎻', label: 'クラシック', name: 'クラシックコンサートのチケット', note: '有名な曲がそろった公演を選びます。' },
    { emoji: '🎤', label: '歌謡曲・演歌', name: '歌謡ショーのチケット', note: '好きな歌手の公演を探します。' },
    { emoji: '🎷', label: 'ジャズ・ポップス', name: 'ジャズ・ポップスのライブチケット', note: '座って聴ける会場を選びます。' },
    { emoji: '⛪', label: '合唱・オペラ', name: '合唱・オペラのチケット', note: '声の厚みは会場でしか味わえません。' }
  ]},

  cinema_ticket: { question: '映画は、どんなのを観ますか？', choices: [
    { emoji: '🗾', label: '邦画', name: '映画館の回数券（邦画向け）', note: '好きなときに使えます。期限の長いものを。' },
    { emoji: '🌍', label: '洋画', name: '映画館の回数券（洋画向け）', note: '字幕でも吹替でも使えます。' },
    { emoji: '🎬', label: 'なんでも観る', name: '映画館の回数券', note: 'どの作品にも使えるものを多めに。' },
    { emoji: '👫', label: '誰かと行きたい', name: '映画館のペア鑑賞券', note: '誘って行けるように2枚組で。' }
  ]},

  lesson: { question: 'やってみたいのは、どれですか？', choices: [
    { emoji: '🏺', label: '陶芸', name: '陶芸の体験レッスン', note: '作ったお茶碗が後日届きます。' },
    { emoji: '🍳', label: '料理', name: '料理教室の体験レッスン', note: '一日だけの単発講座なら気軽です。' },
    { emoji: '💐', label: 'お花', name: 'フラワーアレンジの体験レッスン', note: '作ったものを持って帰れます。' },
    { emoji: '🖌️', label: '絵や書', name: '絵画・書道の体験レッスン', note: '道具は貸してもらえます。' }
  ]},

  catalog: { question: 'カタログなら、どれがいいですか？', choices: [
    { emoji: '🎈', label: '体験が載っているもの', name: '体験だけのカタログギフト', note: 'エステ、クルーズ、陶芸などから選べます。' },
    { emoji: '🍖', label: '食べものが載っているもの', name: 'グルメカタログ', note: '全国のお取り寄せから選べます。' },
    { emoji: '🧺', label: '雑貨が載っているもの', name: '雑貨のカタログギフト', note: '暮らしの道具を自分で選べます。' },
    { emoji: '📚', label: '全部載っているもの', name: '総合カタログギフト', note: '迷う時間ごと楽しんでもらえます。' }
  ]},

  /* ── 音楽・映像 ── */
  music_player: { question: '音楽は、どうやって聴きたいですか？', choices: [
    { emoji: '🗣️', label: '話しかけて出したい', name: 'スマートスピーカー', note: '「◯◯をかけて」で流れます。設定はこちらで。' },
    { emoji: '💿', label: '持っているCDを聴きたい', name: 'CDも聴けるプレーヤー', note: '棚のCDがそのまま使えます。操作も簡単。' },
    { emoji: '📻', label: 'ラジオも聴きたい', name: 'ラジオつきプレーヤー', note: '朝の習慣がそのまま続けられます。' },
    { emoji: '🎧', label: 'ひとりでじっくり', name: 'ヘッドホン・イヤホン', note: '軽くて耳が痛くならないものを。' }
  ]},

  subscription_video: { question: 'どんなのを観たいですか？', choices: [
    { emoji: '🎬', label: '映画', name: '映画が多い動画配信の視聴券', note: '昔の名作もそろっています。' },
    { emoji: '📺', label: '日本のドラマ', name: '国内ドラマが多い視聴券', note: '見逃した回もさかのぼれます。' },
    { emoji: '🇰🇷', label: '韓国ドラマ', name: '韓流ドラマが多い視聴券', note: '長いシリーズも一気に観られます。' },
    { emoji: '🏯', label: '時代劇', name: '時代劇が観られる視聴券', note: '専門のチャンネルもあります。' }
  ]},

  /* ── 趣味・学び ── */
  flower_sub: { question: 'お花は、どんなかたちがいいですか？', choices: [
    { emoji: '💐', label: '切り花が届くの', name: '花の定期便', note: '毎月ちがう花が届きます。花瓶つきのものも。' },
    { emoji: '🪴', label: '鉢植え', name: '鉢植え・寄せ植え', note: '長く楽しめます。手のかからない種類を。' },
    { emoji: '🌾', label: '枯れないもの', name: 'ドライフラワー・プリザーブド', note: '水やりがいりません。飾りっぱなしでも大丈夫。' },
    { emoji: '🌸', label: '特別な一鉢', name: '胡蝶蘭などの特別な鉢', note: '還暦のお祝いらしい、華やかなもの。' }
  ]},

  garden_tools: { question: '庭仕事で、いちばん困るのは？', choices: [
    { emoji: '✂️', label: '枝を切るのが重い', name: '軽い剪定ばさみ', note: '力が要らない構造のもの。手首が楽になります。' },
    { emoji: '🚿', label: '水やり', name: 'じょうろ・軽量ホース', note: '軽くて、伸び縮みするもの。' },
    { emoji: '🪴', label: '植える場所', name: 'プランター・培養土のセット', note: 'ベランダでも置ける大きさで。' },
    { emoji: '🪑', label: 'しゃがむのがつらい', name: '園芸用の椅子・膝当て', note: '座ったまま作業できます。腰にきません。' }
  ]},

  herb_kit: { question: '育てるなら、どれがいいですか？', choices: [
    { emoji: '🌿', label: 'ハーブ', name: 'ハーブの栽培キット', note: 'バジルやミント。摘んでその日の料理に。' },
    { emoji: '🍅', label: 'ミニ野菜', name: 'ミニトマト・葉物の栽培キット', note: '収穫があると続きます。' },
    { emoji: '🍄', label: 'きのこ', name: 'しいたけの栽培キット', note: '数日で出てきます。見ていて面白いです。' },
    { emoji: '💡', label: '土を使わないもの', name: '水耕栽培キット', note: '室内でも汚れません。冬でも育ちます。' }
  ]},

  craft_kit: { question: '手芸なら、どれがお好きですか？', choices: [
    { emoji: '🧶', label: '編みもの', name: '編みものキット', note: '毛糸と編み図のセット。できたら送ってもらいます。' },
    { emoji: '🪡', label: '刺しゅう', name: '刺しゅうキット', note: '図案つき。少しずつ進められます。' },
    { emoji: '🧵', label: 'パッチワーク・裁縫', name: 'パッチワークキット', note: '布のセットと型紙。大きい作品にも。' },
    { emoji: '🎎', label: 'つまみ細工・和の手芸', name: 'つまみ細工のキット', note: '小さくて場所を取りません。飾れます。' }
  ]},

  books: { question: '読むなら、どんな本がいいですか？', choices: [
    { emoji: '📕', label: '小説', name: '好きな作家の小説', note: '読みたかったものをまとめて。' },
    { emoji: '📗', label: 'エッセイ', name: 'エッセイ集', note: '少しずつ読めるので、寝る前にも。' },
    { emoji: '📘', label: '写真集・画集', name: '写真集・画集', note: '眺めるだけでも楽しいもの。大きい判で。' },
    { emoji: '📙', label: '実用書・料理本', name: '料理本・暮らしの本', note: '作ってみたくなるもの。写真の多いものを。' }
  ]},

  letter_set: { question: '書くものなら、どれがいいですか？', choices: [
    { emoji: '🖋️', label: '万年筆', name: '万年筆とインク', note: '書き味のいいもの。細めの字幅で。' },
    { emoji: '✉️', label: '便箋と封筒', name: '上質な便箋・封筒のセット', note: '和紙のものなど。切手も添えて。' },
    { emoji: '🖌️', label: '筆ペン・書道具', name: '筆ペン・書道具のセット', note: 'のし書きにも使えます。' },
    { emoji: '📮', label: 'はがき・切手', name: '季節のはがきと切手', note: '出す口実があると続きます。' }
  ]},

  online_course: { question: '習うなら、どれがいいですか？', choices: [
    { emoji: '🖌️', label: '書道・俳句', name: '書道・俳句の講座', note: '添削してもらえるものを。' },
    { emoji: '🗣️', label: '英会話', name: '英会話の講座', note: '少人数かマンツーマンのものを選びます。' },
    { emoji: '💻', label: 'パソコン・スマホ', name: 'スマホ・パソコン教室', note: 'ゆっくり教えてくれるところを探します。' },
    { emoji: '🏯', label: '歴史・文学', name: '歴史・文学の講座', note: 'カルチャーセンターの単発講座でも。' }
  ]},

  /* ── 家族・つながり ── */
  photo_frame: { question: '写真は、どんなふうに見たいですか？', choices: [
    { emoji: '🖼️', label: '自動で切り替わるもの', name: '写真が自動で届くフォトフレーム', note: 'こちらから送ると勝手に増えます。設定は息子が。' },
    { emoji: '🔍', label: '大きい画面で', name: '大きめのデジタルフォトフレーム', note: '離れていても見えるサイズのもの。' },
    { emoji: '🕰️', label: '時計も兼ねたもの', name: '時計つきフォトフレーム', note: '普段は時計、ときどき写真。' }
  ]},

  photo_book: { question: '思い出のものなら、どれがいいですか？', choices: [
    { emoji: '📖', label: '一冊の本にしたもの', name: '家族写真のフォトブック', note: '昔と今の写真をまとめて。手紙も挟みます。' },
    { emoji: '📔', label: '自分で貼るアルバム', name: 'アルバムと写真のプリント', note: '並べる時間も楽しんでもらえます。' },
    { emoji: '🖼️', label: '飾れるもの', name: '引き伸ばした写真とフレーム', note: '玄関や居間に飾れる大きさで。' },
    { emoji: '🎥', label: '動くもの', name: '家族からのビデオメッセージ', note: '孫や親戚の顔も入れて、一本にまとめます。' }
  ]},

  tablet: { question: '話すときの道具なら、どれがいいですか？', choices: [
    { emoji: '📱', label: 'タブレット', name: '文字の大きいタブレット', note: '見やすい設定にして、通話アプリも入れてから送ります。' },
    { emoji: '📞', label: 'スマホの買い替え', name: '使いやすいスマートフォン', note: '文字が大きく設定できるもの。' },
    { emoji: '🖥️', label: 'もっと大きい画面', name: 'テレビにつなぐビデオ通話の機械', note: '居間のテレビに顔が映ります。' }
  ]},

  trip_together: { question: '一緒に行くなら、どれくらいがいいですか？', choices: [
    { emoji: '🌞', label: '日帰りで気軽に', name: '日帰りのおでかけ', note: '近場で。無理のない距離を選びます。' },
    { emoji: '🌙', label: '一泊二日', name: '一泊二日の旅行', note: 'ちょうどいい長さ。宿はこちらで探します。' },
    { emoji: '🗓️', label: '連泊でゆっくり', name: '連泊でゆっくりする旅行', note: '移動を減らして、同じ宿に滞在します。' },
    { emoji: '🏠', label: 'こちらに来てほしい', name: '息子が帰省して過ごす日', note: '出かけなくても。家でゆっくり過ごします。' }
  ]},

  /* ── 体をいたわる ── */
  walking_pole: { question: '散歩のものなら、どれが要りますか？', choices: [
    { emoji: '🥢', label: '杖・ポール', name: 'ウォーキングポール', note: '軽くて、長さを変えられるもの。' },
    { emoji: '🧥', label: '着るもの', name: 'ウォーキング用の上着', note: '軽くて風を通さないもの。洗えるタイプで。' },
    { emoji: '🎒', label: '持ちもの', name: '軽いリュック・ウエストポーチ', note: '水筒が入る大きさ。肩がこらないもの。' },
    { emoji: '⌚', label: '歩数がわかるもの', name: '歩数計・活動量計', note: '文字が大きく、充電が長もちするもの。' }
  ]},

  yoga: { question: '体を動かすなら、どれがいいですか？', choices: [
    { emoji: '🧘', label: 'ヨガマット', name: 'ヨガマット', note: '厚手で、膝が痛くならないもの。' },
    { emoji: '🎯', label: 'ほぐす道具', name: 'ストレッチポール・マッサージボール', note: '寝転がって乗るだけでも効きます。' },
    { emoji: '⚪', label: 'バランスボール', name: 'バランスボール', note: '座っているだけで体幹に効きます。' },
    { emoji: '💻', label: '教えてくれるもの', name: 'オンラインのヨガレッスン', note: '家で、自分のペースで。録画も見られます。' }
  ]},

  pet_goods: { question: 'ペットのものなら、どれが喜ばれますか？', choices: [
    { emoji: '🍖', label: 'ごはん・おやつ', name: 'いいごはん・おやつの詰め合わせ', note: '普段より少しいいものを。' },
    { emoji: '🛏️', label: 'ベッド・ハウス', name: 'ペット用のベッド', note: '洗えるもの。年をとった子にはやわらかいものを。' },
    { emoji: '🧸', label: 'おもちゃ', name: 'おもちゃの詰め合わせ', note: '遊び方のちがうものを何種類か。' },
    { emoji: '🪮', label: 'お手入れの道具', name: 'ブラシ・お手入れ用品', note: '毛が取れやすいもの。使う人にも楽なもの。' }
  ]}
};
