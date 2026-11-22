export interface MemoryItem {
  id: string;
  image: string;
  date: string;
  title: string;
  caption: string;
  description: string;
  sticker?: string;
  rotation?: number; // degrees for polaroid tilt (-5 to 5)
}

export interface GameChallenge1Box {
  id: number;
  label: string;
  icon: string;
  message: string;
  giftTag: string;
}

export interface GameChallenge2Question {
  question: string;
  subtitle: string;
  options: {
    id: string;
    text: string;
    reaction: string;
    scoreLabel: string;
  }[];
}

export interface GameChallenge3Card {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  blessing: string;
  auraColor: string;
}

export interface BirthdayConfig {
  // Personal Info
  recipientName: string;
  recipientNickname: string;
  birthdayDate: string;
  birthYear?: string;
  senderName: string;
  
  // Theme & Styling
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    bgGradient: string;
  };

  // Chapter 1: Secret Invitation
  invitation: {
    teaser: string;
    subTeaser: string;
    buttonText: string;
    badgeText: string;
  };

  // Chapter 2: Gift Opening
  giftOpening: {
    promptText: string;
    buttonText: string;
    greetingPopup: string;
  };

  // Chapter 3: Grand Birthday Celebration
  celebration: {
    headline: string;
    subheadline: string;
    quote: string;
    buttonText: string;
  };

  // Chapter 4: Make a Wish
  makeAWish: {
    title: string;
    instructionHold: string;
    instructionMic: string;
    micFallbackHint: string;
    blownTitle: string;
    blownSubtitle: string;
    continueButton: string;
  };

  // Chapter 5: Scrapbook Memories
  memories: MemoryItem[];

  // Chapter 6: Mini Game Challenges
  game: {
    title: string;
    subtitle: string;
    challenge1: {
      title: string;
      prompt: string;
      boxes: GameChallenge1Box[];
    };
    challenge2: GameChallenge2Question;
    challenge3: {
      title: string;
      prompt: string;
      cards: GameChallenge3Card[];
    };
    completedTitle: string;
    completedMessage: string;
  };

  // Chapter 7: Secret Letter
  secretLetter: {
    title: string;
    senderNote: string;
    date: string;
    paragraphs: string[];
    closing: string;
    signOff: string;
  };

  // Chapter 8: Final Surprise
  finalSurprise: {
    preTitle: string;
    headline: string;
    wishes: string[];
    closingQuote: string;
    credit: string;
    shareTitle: string;
    shareText: string;
  };

  // Music & Audio
  audio: {
    // High-fidelity background music URL (fallback to Web Audio synthesizer if offline)
    backgroundMusicUrl: string;
    defaultVolume: number;
    autoPlayPrompt: boolean;
  };
}

export const BIRTHDAY_CONFIG: BirthdayConfig = {
  recipientName: "Minh Anh",
  recipientNickname: "Bé Meo",
  birthdayDate: "24.11",
  birthYear: "Tuổi 20 Rực Rỡ",
  senderName: "Người Bạn Tri Kỷ ✨",

  theme: {
    primaryColor: "#FF5E8E",
    secondaryColor: "#B794F6",
    accentColor: "#FCD34D",
    bgGradient: "from-[#080512] via-[#120B24] to-[#1A0E38]",
  },

  invitation: {
    teaser: "Hey! Có một điều vô cùng đặc biệt đang chờ bạn...",
    subTeaser: "Chỉ dành riêng cho một người đặc biệt nhất ngày hôm nay.",
    buttonText: "MỞ MÓN QUÀ BÍ MẬT",
    badgeText: "CHẠM ĐỂ MỞ THIỆP"
  },

  giftOpening: {
    promptText: "Bạn có chắc mình đã sẵn sàng mở chiếc hộp ma thuật này không?",
    buttonText: "YES, MÌNH SẴN SÀNG RỒI!",
    greetingPopup: "Chúc Mừng Sinh Nhật, "
  },

  celebration: {
    headline: "HAPPY BIRTHDAY",
    subheadline: "Hôm nay là ngày rực rỡ nhất của bạn!",
    quote: "Một năm nữa đã qua. Thêm một hành trình tuyệt đẹp. Thêm một lý do để toả sáng rạng ngời như ánh sao trời.",
    buttonText: "THỔI NẾN VÀ ƯỚC NGUYỆN"
  },

  makeAWish: {
    title: "Trước khi bước sang tuổi mới, hãy nhắm mắt và ước một điều thật đẹp nhé!",
    instructionHold: "Bật micro và thổi vào mic để dập tắt nến sinh nhật",
    instructionMic: "Hãy ghé sát và thổi một luồng hơi thật mạnh vào micro",
    micFallbackHint: "Hệ thống chỉ nhận diện luồng hơi thổi trực tiếp vào mic (tiếng nói chuyện hay tiếng ồn sẽ không được tính)",
    blownTitle: "Ước nguyện đã được gửi tới vũ trụ! ✨",
    blownSubtitle: "Tuổi mới, mong mọi điều bình an, hạnh phúc và may mắn nhất sẽ tìm đến bạn.",
    continueButton: "LẬT MỞ NHỮNG KỶ NIỆM"
  },

  memories: [
    {
      id: "mem-1",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80",
      date: "Chuyến đi mùa hè",
      title: "Nụ cười tỏa nắng",
      caption: "Những ngày vô tư rong ruổi cùng nhau",
      description: "Nhớ hôm đó trời nắng to mà hai đứa vẫn cười toe toét chụp cả trăm tấm ảnh. Nụ cười của bạn lúc nào cũng làm mọi người thấy nhẹ nhõm.",
      sticker: "☀️",
      rotation: -3
    },
    {
      id: "mem-2",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      date: "Cà phê góc phố",
      title: "Những buổi tâm sự muộn",
      caption: "Cốc trà sữa và hàng ngàn câu chuyện",
      description: "Có những ngày mệt mỏi chỉ cần ngồi cà phê buôn chuyện trên trời dưới đất với bạn là tự nhiên tan biến hết áp lực.",
      sticker: "☕",
      rotation: 2.5
    },
    {
      id: "mem-3",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80",
      date: "Hoàng hôn lộng gió",
      title: "Góc ngắm cảnh chill",
      caption: "Lúc ngắm mặt trời lặn thật bình yên",
      description: "Bầu trời hôm ấy nhuộm màu tím hồng hệt như trong tranh vẽ. Cảm ơn vì đã luôn có bạn đồng hành trong từng khoảnh khắc.",
      sticker: "🌅",
      rotation: -2
    },
    {
      id: "mem-4",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80",
      date: "Những khoảnh khắc tự nhiên",
      title: "Cô gái luôn toả sáng",
      caption: "Đẹp nhất là khi bạn là chính mình",
      description: "Dù vui hay buồn, lúc nào bạn cũng mang lại năng lượng tích cực ấm áp cho những người xung quanh.",
      sticker: "✨",
      rotation: 3.5
    },
    {
      id: "mem-5",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80",
      date: "Tiệc sinh nhật ấm áp",
      title: "Nguyện ước tuổi mới",
      caption: "Bánh kem ngọt ngào và những nụ cười",
      description: "Những lời chúc tốt đẹp nhất luôn dành cho bạn, mong tuổi mới rực rỡ và luôn hạnh phúc ngập tràn.",
      sticker: "🎂",
      rotation: -1.5
    },
    {
      id: "mem-6",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80",
      date: "Chuyến bay mùa thu",
      title: "Chạm vào những vùng đất mới",
      caption: "Tuổi trẻ là những chuyến đi bất tận",
      description: "Cùng nhau xách ba lô lên và đi, ngắm nhìn thế giới bao la và lưu giữ những kỷ niệm đẹp nhất.",
      sticker: "✈️",
      rotation: 2.5
    },
    {
      id: "mem-7",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80",
      date: "Dạo phố đêm lung linh",
      title: "Đêm phố thị rực rỡ",
      caption: "Gió đêm mát rượi và những câu chuyện không hồi kết",
      description: "Lượn lờ phố phường lúc nửa đêm, ăn những món ăn vỉa hè quen thuộc và cười đùa thoải mái không chút muộn phiền.",
      sticker: "🌙",
      rotation: -2.5
    },
    {
      id: "mem-8",
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=800&auto=format&fit=crop&q=80",
      date: "Mùa hoa rực rỡ",
      title: "Phiên bản tuyệt vời nhất",
      caption: "Luôn xinh đẹp, tự tin và yêu đời nhé",
      description: "Mong bạn luôn giữ được nét hồn nhiên, sự vui tươi và tỏa sáng rực rỡ như những đóa hoa mùa xuân.",
      sticker: "🌸",
      rotation: 3
    }
  ],

  game: {
    title: "THE SECRET BIRTHDAY CHALLENGE",
    subtitle: "Vượt qua 3 mini game để mở khóa bức thư bí mật",
    challenge1: {
      title: "Thử Thách 1: Hộp Quà May Mắn",
      prompt: "Chọn 1 trong 3 chiếc hộp bí ẩn dưới đây để nhận phần quà đầu tiên:",
      boxes: [
        {
          id: 1,
          label: "Hộp Pha Lê Hồng",
          icon: "💎",
          message: "Bạn nhận được: 365 ngày tràn ngập niềm vui, tài khoản luôn đầy tiền và những chuyến đi du lịch bất tận!",
          giftTag: "+100 Niềm Vui"
        },
        {
          id: 2,
          label: "Hộp Ánh Sao Vàng",
          icon: "🌟",
          message: "Bạn nhận được: Một đặc quyền ăn bao nhiêu cũng không tăng cân, da luôn căng bóng và luôn gặp quý nhân phù trợ!",
          giftTag: "+999 May Mắn"
        },
        {
          id: 3,
          label: "Hộp Ma Thuật Tím",
          icon: "🔮",
          message: "Bạn nhận được: Tấm vé bảo kê trọn đời từ bạn thân! Bất kể khi nào bạn cần, luôn có một người sẵn sàng lắng nghe.",
          giftTag: "+Vô Hạn Tình Bạn"
        }
      ]
    },
    challenge2: {
      question: "Câu Hỏi Nhanh: Điều bạn mong chờ nhất trong tuổi mới này là gì?",
      subtitle: "Hãy chọn thật lòng nhé, đáp án nào cũng đúng!",
      options: [
        {
          id: "opt-1",
          text: "Tự do khám phá, đi du lịch thật nhiều nơi ✈️",
          reaction: "Chuẩn bài! Thế giới rộng lớn đang chờ dấu chân bạn!",
          scoreLabel: "Tâm hồn phiêu lưu"
        },
        {
          id: "opt-2",
          text: "Sự nghiệp thăng hoa, tiền tài rủng rỉnh 💰",
          reaction: "Tuyệt đỉnh! Tuổi mới giàu sụ, nhớ bao chầu cà phê nhé!",
          scoreLabel: "Triệu phú tương lai"
        },
        {
          id: "opt-3",
          text: "Tâm an nhiên, sức khỏe dồi dào, luôn tươi vui 🌸",
          reaction: "Món quà quý giá nhất! Một tâm hồn bình an giữa dòng đời.",
          scoreLabel: "An yên hạnh phúc"
        },
        {
          id: "opt-4",
          text: "Cả 3 điều trên luôn không thiếu thứ nào! 👑",
          reaction: "Quá tham lam nhưng vũ trụ duyệt luôn cho bạn!",
          scoreLabel: "Trọn vẹn 100 điểm"
        }
      ]
    },
    challenge3: {
      title: "Thử Thách 3: Rút Thẻ Bài Định Mệnh",
      prompt: "Lật mở một lá bài tarot chúc phúc cho tuổi mới:",
      cards: [
        {
          id: 1,
          title: "THE SUN",
          subtitle: "Thần Mặt Trời Toả Sáng",
          icon: "☀️",
          blessing: "Lá bài dự báo một năm rực rỡ hào quang, mọi nỗ lực của bạn đều sẽ đơm hoa kết trái ngọt ngào!",
          auraColor: "from-amber-400 to-rose-400"
        },
        {
          id: 2,
          title: "THE STAR",
          subtitle: "Ngôi Sao Hy Vọng",
          icon: "⭐",
          blessing: "Mọi điều bạn thầm ước nguyện trong đêm nay đều sẽ dần biến thành hiện thực diệu kỳ!",
          auraColor: "from-rose-400 to-amber-300"
        },
        {
          id: 3,
          title: "THE MAGICIAN",
          subtitle: "Phù Thủy Quyền Năng",
          icon: "🪄",
          blessing: "Bạn nắm giữ sức mạnh biến những ngày bình thường thành những khoảnh khắc phi thường tuyệt đỉnh!",
          auraColor: "from-amber-400 to-rose-400"
        }
      ]
    },
    completedTitle: "BẠN ĐÃ CHIẾN THẮNG TẤT CẢ THỬ THÁCH!",
    completedMessage: "Giờ là lúc mở phong ấn Bức Thư Bí Mật dành riêng cho bạn..."
  },

  secretLetter: {
    title: "Gửi Bạn, Người Vô Cùng Đặc Biệt",
    senderNote: "Viết bởi sự chân thành từ tận đáy lòng",
    date: "Sinh nhật năm nay",
    paragraphs: [
      "Chào bạn! Khi bạn đọc những dòng này, chắc hẳn bạn đã trải qua những giây phút bất ngờ nho nhỏ mà mình đã tỉ mẩn chuẩn bị rồi đúng không?",
      "Thời gian trôi qua nhanh thật đấy, vậy là chúng mình lại cùng nhau đón thêm một cột mốc tuổi mới của bạn. Nhìn lại chặng đường vừa qua, có những ngày vui tột cùng và cũng có những lúc áp lực bộn bề, nhưng điều tuyệt vời nhất là bạn vẫn luôn mạnh mẽ, kiên cường và chưa từng đánh mất sự thiện lương, nụ cười rạng rỡ vốn có.",
      "Cảm ơn bạn vì đã xuất hiện, đã đồng hành và mang đến cho thế giới này (và cả mình nữa) thật nhiều năng lượng ấm áp, chân thật. Ở bên bạn, mọi thứ luôn trở nên dễ chịu và tràn đầy tiếng cười.",
      "Bước sang tuổi mới, mình chỉ mong bạn luôn giữ được ngọn lửa đam mê trong tim. Mong bạn được ăn những món ngon mình thích, đến những nơi mình từng mơ, yêu thương bản thân nhiều hơn mỗi ngày và luôn nhớ rằng: Bạn luôn xứng đáng với những điều tốt đẹp nhất trên đời này!",
      "Dù ngoài kia cuộc sống có hối hả đến đâu, mong bạn đừng bao giờ quên nụ cười tỏa nắng của chính mình nhé."
    ],
    closing: "Mãi là người bạn tuyệt vời nhất!",
    signOff: "With love & huge hugs ❤️"
  },

  finalSurprise: {
    preTitle: "Khoan đã... Vẫn còn một điều nữa!",
    headline: "HAPPY BIRTHDAY!",
    wishes: [
      "Chúc bạn một tuổi mới rực rỡ như hoa mùa xuân 🌸",
      "Hạnh phúc ngập tràn, vạn sự hanh thông ✨",
      "Tiền vào như nước, tình duyên ngọt ngào 💫",
      "Và đừng bao giờ đánh mất phiên bản tuyệt vời nhất của chính mình!"
    ],
    closingQuote: "Chúc bạn một tuổi mới thật rực rỡ. Luôn vui vẻ, luôn xinh đẹp và đừng bao giờ đánh mất phiên bản tuyệt vời nhất của chính mình! ✨",
    credit: "Made with ❤️, just for you.",
    shareTitle: "The Birthday Experience | Món quà sinh nhật đặc biệt",
    shareText: "Một món quà sinh nhật kỹ thuật số tương tác đặc biệt dành tặng bạn!"
  },

  audio: {
    backgroundMusicUrl: "/audio/birthday-music.mp3",
    defaultVolume: 0.6,
    autoPlayPrompt: true
  }
};
