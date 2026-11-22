# THE BIRTHDAY EXPERIENCE 🎂✨
> Một trải nghiệm web thiệp sinh nhật tương tác cao cấp (Interactive Birthday Web Experience), thiết kế theo phong cách Cinematic, Mobile-First, tạo sự bất ngờ và cảm xúc mạnh mẽ cho người nhận qua mã QR.

---

## 🌟 TỔNG QUAN 8 CHƯƠNG TRẢI NGHIỆM

1. **Chương I – The Secret Invitation (Lời Mời Bí Mật):**
   - Phong bì thư 3D với con dấu sáp trái tim nổi bật.
   - Hiệu ứng hạt ánh sáng lấp lánh (Floating Star Particles), vỡ con dấu và mở nắp phong bì bằng luồng sáng diệu kỳ.
   - Kích hoạt âm thanh và nhạc nền mượt mà ngay từ tương tác đầu tiên.

2. **Chương II – The Gift Opening (Mở Hộp Quà Ma Thuật):**
   - Hộp quà 3D với nơ ruy băng vàng óng, ánh sáng nội tại tỏa ra từ bên trong.
   - Nắp hộp bật mở tung bay, pháo hoa và confetti bùng nổ.
   - Tấm thiệp mạ vàng bay lên hiển thị tên người nhận: `Happy Birthday, [RECIPIENT_NAME]!`.

3. **Chương III – Birthday Celebration (Đại Tiệc Sinh Nhật):**
   - Màn hình visual đỉnh cao với tiêu đề HAPPY BIRTHDAY animated typography.
   - Bánh kem sinh nhật 3D nhiều tầng lộng lẫy với lớp kem dâu, hạt ngọc trai vàng, dâu tây và nến đang cháy bập bùng với hiệu ứng ngọn lửa chân thực.
   - Pháo hoa nền (Canvas Fireworks), bóng bay lơ lửng và ánh sao lung linh.

4. **Chương IV – Make A Wish (Ước Nguyện Tuổi Mới):**
   - Trải nghiệm thổi nến tương tác 2 chế độ:
     + **Cách 1:** Nhấn giữ nút thổi nến (hiển thị tiến trình % mượt mà).
     + **Cách 2:** Thổi trực tiếp vào Micro của điện thoại (hệ thống tự động phân tích tần số âm thanh luồng gió).
   - Khi nến tắt: Ngọn lửa rung lắc và tắt dần, khói bốc lên mờ ảo, pháo hoa đại tiệc nổ rực rỡ kèm lời chúc ước nguyện thành hiện thực.

5. **Chương V – Our Memories (Cuốn Sổ Kỷ Niệm Polaroid Scrapbook):**
   - Album ảnh kỷ niệm phong cách Scrapbook cổ điển với băng keo washi tape, ảnh nghiêng tự nhiên, sticker ngộ nghĩnh, tem ngày tháng và caption viết tay.
   - Vuốt chuyển ảnh mượt mà, hỗ trợ thả tim kỷ niệm.
   - Bấm vào ảnh để mở **Lightbox toàn màn hình** kèm câu chuyện chi tiết.

6. **Chương VI – Birthday Challenge (Thử Thách Vui Nhộn):**
   - Mini game giải trí 3 vòng:
     + *Vòng 1:* Chọn 1 trong 3 hộp quà bí ẩn (nhận thông điệp hài hước & may mắn).
     + *Vòng 2:* Câu hỏi nhanh về điều ước tuổi mới với phản hồi tích cực.
     + *Vòng 3:* Rút lá bài Tarot định mệnh (The Sun, The Star, The Magician).
   - Thanh tiến trình tương tác và âm thanh chúc mừng chiến thắng (Fanfare).

7. **Chương VII – The Secret Letter (Bức Thư Bí Mật):**
   - Bức thư tay trên nền giấy vintage có vân texture, niêm phong phong bì.
   - Chạm mở phong bì, từng đoạn thư tay hiển thị với typography chân thành, tự nhiên, giàu cảm xúc và đậm chất cá nhân hóa.

8. **Chương VIII – The Final Surprise (Món Quà Cuối Cùng):**
   - Màn kết bất ngờ với hộp quà huyền bí mở ra vũ bão pháo hoa toàn màn hình.
   - Lời chúc tiếng Việt xúc động và ý nghĩa.
   - Bộ nút tương tác hoàn chỉnh:
     + 🔄 **Xem lại từ đầu (Replay):** Reset mượt mà toàn bộ trạng thái.
     + 📸 **Xem lại kỷ niệm (Memories):** Nhảy nhanh về album ảnh.
     + 🔗 **Chia sẻ món quà:** Tích hợp Web Share API trên điện thoại hoặc tự động sao chép link.
     + 🎫 **Thiệp Giấy & Tải Mã QR In:** Mở trang thiệp in kèm mã QR chất lượng cao.

---

## 🎨 TÙY CHỈNH NỘI DUNG DỄ DÀNG TRONG 2 PHÚT

Toàn bộ dữ liệu được quản lý tập trung tại file:
📁 **`src/config/birthday.config.ts`**

Bạn chỉ cần mở file này và chỉnh sửa các trường:

```typescript
export const BIRTHDAY_CONFIG = {
  // 1. Tên người nhận
  recipientName: "Minh Anh",
  recipientNickname: "Bé Meo",
  birthdayDate: "24.11",
  birthYear: "Tuổi 20 Rực Rỡ",
  senderName: "Người Bạn Tri Kỷ ✨",

  // 2. Danh sách ảnh kỷ niệm (thay link ảnh và lời chú thích)
  memories: [
    {
      id: "mem-1",
      image: "đường_dẫn_ảnh_của_bạn_hoặc_link_online",
      date: "Chuyến đi Đà Lạt",
      title: "Nụ cười tỏa nắng",
      caption: "Những ngày vô tư rong ruổi cùng nhau",
      description: "Kỷ niệm đáng nhớ...",
      sticker: "☀️",
      rotation: -3
    },
    // ... thêm ảnh tùy thích
  ],

  // 3. Nội dung bức thư bí mật (tự nhiên, không sáo rỗng)
  secretLetter: {
    title: "Gửi Bạn, Người Vô Cùng Đặc Biệt",
    paragraphs: [
      "Đoạn 1...",
      "Đoạn 2..."
    ],
    closing: "Mãi là người bạn tuyệt vời nhất!",
    signOff: "With love & huge hugs ❤️"
  },

  // 4. Nhạc nền (Link MP3/OGG hoặc tự động dùng bộ tổng hợp Synthesizer offline)
  audio: {
    backgroundMusicUrl: "https://your-audio-link.mp3",
    defaultVolume: 0.6,
  }
};
```

---

## 🔊 HỆ THỐNG ÂM THANH CHUYÊN NGHIỆP

- **Web Audio API Procedural Synthesizer:** Tích hợp bộ tổng hợp âm thanh chuyên dụng bằng code (không sợ lỗi 404 mất file âm thanh):
  + Tiếng giấy sột soạt khi mở thư / phong bì.
  + Tiếng pop vang lách cách khi nắp hộp quà bật mở.
  + Tiếng phù hơi gió chân thực khi thổi nến.
  + Tiếng nổ pháo hoa trầm ấm kèm tiếng lách tách.
  + Chuông phong linh pentatonic lấp lánh (Chimes).
  + Khúc nhạc khải hoàn chiến thắng (Victory Fanfare).
  + Bản nhạc mừng sinh nhật Lo-Fi Music Box tự động chạy nếu không có mạng.
- **Nút điều khiển âm nhạc:** Nút nổi góc trên màn hình hỗ trợ Mute/Unmute, thanh chỉnh âm lượng và hiệu ứng cột sóng nhạc nhảy theo điệu.

---

## 🚀 HƯỚNG DẪN CHẠY VÀ DEPLOY PUBLIC

### 1. Chạy trên máy cục bộ (Development)
```bash
# Cài đặt thư viện (nếu chưa)
npm install

# Khởi chạy server phát triển
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 2. Build sản phẩm hoàn chỉnh
```bash
npm run build
```
Thư mục `dist/` sẽ được tạo ra với code đã được nén tối ưu.

### 3. Hướng dẫn Deploy lên Vercel (Miễn phí, 1 phút)
1. Đăng ký tài khoản tại [vercel.com](https://vercel.com).
2. Tải mã nguồn lên GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "feat: epic birthday website"
   git branch -M main
   git remote add origin https://github.com/username/ten-repo.git
   git push -u origin main
   ```
3. Trên dashboard Vercel, bấm **"Add New Project"** -> chọn repository vừa đẩy lên.
4. Giữ nguyên cấu hình mặc định (Framework Preset: **Vite**).
5. Bấm **Deploy**. Sau 30 giây, bạn sẽ nhận được một đường link public chính thức dạng: `https://ten-du-an.vercel.app`.

### 4. Tạo và In Thiệp Kèm Mã QR
1. Mở trang web đã deploy trên trình duyệt.
2. Bấm vào nút **"Mã QR"** ở góc trên thanh tiến trình (hoặc ở màn kết thúc).
3. Nhập đường link website đã deploy của bạn vào ô link.
4. Bấm **"Tải QR PNG"** để lưu ảnh mã QR sắc nét.
5. Hoặc bấm **"In Thiệp Ngay"** để in trực tiếp tấm thiệp quà tặng kèm mã QR ra giấy cứng để gửi tặng bạn bè!
