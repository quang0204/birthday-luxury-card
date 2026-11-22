export interface Memory {
  id: string;
  image: string;
  title: string;
  date?: string;
  location?: string;
  caption: string;
  description?: string;
  order?: number;
  sticker?: string;
  rotation?: number;
}

export const defaultMemories: Memory[] = [
  {
    id: "memory-01",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&auto=format&fit=crop&q=85",
    title: "Nụ cười tỏa nắng đầu hè",
    date: "15.06.2024",
    location: "Bờ Hồ Tây lộng gió",
    caption: "Những ngày vô tư rong ruổi cùng nhau",
    description: "Nhớ hôm đó trời nắng to mà hai đứa vẫn cười toe toét chụp cả trăm tấm ảnh. Nụ cười của bạn lúc nào cũng làm mọi người thấy nhẹ nhõm và yêu đời.",
    order: 1,
    sticker: "☀️",
    rotation: -3
  },
  {
    id: "memory-02",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=85",
    title: "Những buổi tâm sự muộn",
    date: "28.08.2024",
    location: "Góc quán cà phê nhỏ",
    caption: "Cốc trà sữa và hàng ngàn câu chuyện",
    description: "Có những ngày mệt mỏi chỉ cần ngồi cà phê buôn chuyện trên trời dưới đất với bạn là tự nhiên tan biến hết áp lực. Cảm ơn vì luôn lắng nghe.",
    order: 2,
    sticker: "☕",
    rotation: 2
  },
  {
    id: "memory-03",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&auto=format&fit=crop&q=85",
    title: "Hoàng hôn màu tím hồng",
    date: "12.09.2024",
    location: "Đỉnh đồi ngắm hoàng hôn",
    caption: "Lúc ngắm mặt trời lặn thật bình yên",
    description: "Bầu trời hôm ấy nhuộm màu tím hồng hệt như trong tranh vẽ. Cảm ơn vì đã luôn có bạn đồng hành trong từng khoảnh khắc kỳ diệu của cuộc sống.",
    order: 3,
    sticker: "🌅",
    rotation: -2
  },
  {
    id: "memory-04",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=85",
    title: "Cô gái luôn toả sáng",
    date: "04.10.2024",
    location: "Dưới ánh đèn lung linh",
    caption: "Đẹp nhất là khi bạn là chính mình",
    description: "Dù vui hay buồn, lúc nào bạn cũng mang lại năng lượng tích cực ấm áp cho những người xung quanh. Hãy luôn giữ nụ cười rạng rỡ này nhé!",
    order: 4,
    sticker: "✨",
    rotation: 3
  },
  {
    id: "memory-05",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=900&auto=format&fit=crop&q=85",
    title: "Nguyện ước tuổi mới",
    date: "24.11.2024",
    location: "Bữa tiệc ấm áp",
    caption: "Bánh kem ngọt ngào và những nụ cười",
    description: "Những lời chúc tốt đẹp nhất luôn dành cho bạn, mong tuổi mới rực rỡ và luôn ngập tràn niềm vui cùng hạnh phúc trọn vẹn.",
    order: 5,
    sticker: "🎂",
    rotation: -1.5
  },
  {
    id: "memory-06",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&auto=format&fit=crop&q=85",
    title: "Chạm vào những vùng đất mới",
    date: "18.01.2025",
    location: "Chuyến bay xa đầu năm",
    caption: "Tuổi trẻ là những chuyến đi bất tận",
    description: "Cùng nhau xách ba lô lên và đi, ngắm nhìn thế giới bao la và lưu giữ những tấm hình kỷ niệm đẹp nhất thanh xuân.",
    order: 6,
    sticker: "✈️",
    rotation: 2.5
  },
  {
    id: "memory-07",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&auto=format&fit=crop&q=85",
    title: "Đêm phố thị rực rỡ",
    date: "14.02.2025",
    location: "Phố đi bộ ngập tràn ánh đèn",
    caption: "Gió đêm mát rượi và những câu chuyện không hồi kết",
    description: "Lượn lờ phố phường lúc nửa đêm, ăn những món ăn vỉa hè quen thuộc và cười đùa thoải mái không chút muộn phiền.",
    order: 7,
    sticker: "🌙",
    rotation: -2
  },
  {
    id: "memory-08",
    image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=900&auto=format&fit=crop&q=85",
    title: "Mùa hoa rực rỡ",
    date: "08.03.2025",
    location: "Vườn hoa ngát hương",
    caption: "Mỗi đóa hoa như nụ cười của bạn",
    description: "Bước đi giữa ngàn hoa tươi thắm, chúc cho cuộc đời của bạn cũng ngát hương và dịu dàng như chính bạn vậy.",
    order: 8,
    sticker: "🌸",
    rotation: 1.5
  },
  {
    id: "memory-09",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&auto=format&fit=crop&q=85",
    title: "Khoảnh khắc ngẫu hứng",
    date: "20.04.2025",
    location: "Góc phố quen",
    caption: "Chẳng cần tạo dáng, chỉ cần có nhau",
    description: "Bức ảnh chụp vội nhưng lại chứa chan nụ cười rạng rỡ nhất. Tình bạn đẹp nhất là khi ở cạnh nhau chẳng cần giữ kẽ.",
    order: 9,
    sticker: "📸",
    rotation: -1
  },
  {
    id: "memory-10",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&auto=format&fit=crop&q=85",
    title: "Giai điệu của tuổi trẻ",
    date: "15.06.2025",
    location: "Đêm nhạc acoustic",
    caption: "Âm nhạc làm dịu tâm hồn",
    description: "Ngồi dưới ánh đèn vàng nghe từng nốt guitar mộc mạc cất lên. Một buổi tối êm đềm ghi dấu trong ký ức.",
    order: 10,
    sticker: "🎶",
    rotation: 3
  },
  {
    id: "memory-11",
    image: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=900&auto=format&fit=crop&q=85",
    title: "Cháy hết mình với đam mê",
    date: "05.08.2025",
    location: "Hành trình chinh phục mục tiêu",
    caption: "Cứ kiên trì rồi thành công sẽ đến",
    description: "Nhìn thấy bạn nỗ lực không ngừng nghỉ và đạt được kết quả xứng đáng là niềm tự hào lớn của tất cả bạn bè.",
    order: 11,
    sticker: "🌟",
    rotation: -2.5
  },
  {
    id: "memory-12",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&auto=format&fit=crop&q=85",
    title: "Pháo hoa mừng tuổi mới",
    date: "24.11.2025",
    location: "Bầu trời rực rỡ",
    caption: "Một tương lai bừng sáng đang chờ phía trước",
    description: "Chúc mọi ước mơ bạn ấp ủ đều sẽ trở thành hiện thực rực rỡ như những chùm pháo hoa thắp sáng đêm nay!",
    order: 12,
    sticker: "🎆",
    rotation: 2
  }
];
