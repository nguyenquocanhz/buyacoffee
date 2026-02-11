/**
 * Telegram Notification Script for GitHub Actions
 * Yêu cầu Node.js v18+ (để sử dụng native fetch)
 * * Các biến môi trường cần thiết (được truyền từ GitHub Actions):
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 * - GITHUB_REPOSITORY
 * - GITHUB_REF_NAME
 * - GITHUB_ACTOR
 * - GITHUB_SHA
 * - GITHUB_SERVER_URL
 * - GITHUB_RUN_ID
 * - DEPLOY_STATUS (Optional: 'success' | 'failure' | 'cancelled')
 */

const https = require('https');

async function sendTelegramNotification() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("❌ Lỗi: Thiếu TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID.");
    process.exit(1);
  }

  // Lấy thông tin từ biến môi trường của GitHub Actions
  const repo = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_REF_NAME;
  const actor = process.env.GITHUB_ACTOR;
  const commitMsg = process.env.COMMIT_MESSAGE || 'No commit message';
  const commitSha = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : 'unknown';
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const status = (process.env.DEPLOY_STATUS || 'success').toLowerCase();
  
  // Cấu hình hiển thị theo trạng thái
  const statusConfig = {
    success: { icon: '🚀', title: 'DEPLOY SUCCESSFUL' },
    failure: { icon: '❌', title: 'DEPLOY FAILED' },
    cancelled: { icon: '⚠️', title: 'DEPLOY CANCELLED' }
  };

  const { icon, title } = statusConfig[status] || { icon: '📢', title: `DEPLOY ${status.toUpperCase()}` };

  // Thời gian hiện tại (theo giờ Việt Nam)
  const time = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Nội dung tin nhắn (Sử dụng HTML parse mode cho dễ format)
  const message = `
<b>${icon} ${title}</b>

📦 <b>Project:</b> <code>${repo}</code>
🌿 <b>Branch:</b> <code>${branch}</code>
👤 <b>Dev:</b> ${actor}
📝 <b>Commit:</b> <code>${commitSha}</code> - ${commitMsg}
⏰ <b>Time:</b> ${time}

👉 <a href="${runUrl}">Xem chi tiết tại GitHub Actions</a>
  `;

  const payload = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${token}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Đã gửi thông báo Telegram thành công!');
          resolve();
        } else {
          console.error(`❌ Lỗi API Telegram: ${res.statusCode} - ${data}`);
          reject(new Error(`Status code: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Lỗi Request: ${error.message}`);
      reject(error);
    });

    req.write(payload);
    req.end();
  });
}

// Chạy hàm
sendTelegramNotification().catch(err => {
  console.error(err);
  process.exit(1);
});