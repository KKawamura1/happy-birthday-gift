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

  { id: 'q_morning', text: '朝いちばんに飲むものは？',
    choices: [
      { emoji: '☕', label: 'コーヒー', tags: { drink: 4, appliance: 1 } },
      { emoji: '🍵', label: '日本茶', tags: { tea: 4, drink: 2, home: 1 } },
      { emoji: '💧', label: '白湯やお水', tags: { health: 3, drink: -1 } }
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
      { emoji: '🎼', label: '舞台・美術館・コンサート', tags: { culture: 4, experience: 2, music: 2 } }
    ] },

  { id: 'q_home', text: 'おうちにいる時間、何をしていることが多いですか？',
    choices: [
      { emoji: '📺', label: 'テレビや映画を見る', tags: { movie: 4, home: 2, relax: 2 } },
      { emoji: '🌱', label: '庭いじり・お花の世話', tags: { garden: 4, hobby: 2 } },
      { emoji: '🧵', label: '手芸や読書', tags: { craft: 3, book: 3, hobby: 2 } },
      { emoji: '🍳', label: '料理やお菓子づくり', tags: { kitchen: 4, appliance: 2 } }
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
      { emoji: '🚫', label: 'どちらもいません', tags: { pet: -3, garden: -2 } }
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
      { emoji: '🧸', label: 'パジャマや部屋着ならぜひ', tags: { roomwear: 4, home: 2, fashion: 1 } }
    ] },

  { id: 'q_honne', text: 'ここだけの話。どれかひとつ選べるとしたら、本当は？',
    sub: '遠慮しなくて大丈夫です。正直なところを押してください。',
    choices: [
      { emoji: '🍩', label: 'やっぱり食べものが一番うれしい', tags: { food: 3, consumable: 3, sweets: 1 } },
      { emoji: '🏆', label: 'ずっと使えるものが欲しい', tags: { keepsake: 3, luxury: 2, practical: 1 } },
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
      { emoji: '📞', label: '電話やビデオ通話', tags: { gadget: 3, together: 3, family: 2, tech_ok: 2 } }
    ] }
];
