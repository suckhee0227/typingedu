/**
 * 타이핑 에듀 - 문의 폼 Google Apps Script
 *
 * 설정 방법:
 * 1. Google Sheets에서 새 스프레드시트 생성
 * 2. 시트 이름을 "문의"로 변경
 * 3. A1:F1에 헤더 입력: 접수일시 | 이름 | 기관명 | 연락처 | 문의내용 | 상태
 * 4. 확장 프로그램 > Apps Script 클릭
 * 5. 이 코드를 붙여넣기
 * 6. 배포 > 새 배포 > 웹 앱 선택
 *    - 실행 사용자: 본인
 *    - 액세스 권한: 모든 사용자
 * 7. 배포 후 웹 앱 URL을 복사하여 .env의 VITE_GAS_URL에 입력
 */

const SHEET_NAME = "문의";
const SECRET_KEY = "/xspyF7fij9TpvOuwvCsqKEfmz0CYJFJpDBP1u4lrwY="; // 프론트엔드 .env의 VITE_GAS_SECRET과 동일하게 설정
const RATE_LIMIT_SECONDS = 30;
const MAX_FIELD_LENGTH = 500;

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, organization, phone, message, _secret } = data;

    if (_secret !== SECRET_KEY) {
      return jsonResponse(403, { success: false, message: "권한이 없습니다" });
    }

    if (!name || !organization || !phone || !message) {
      return jsonResponse(400, { success: false, message: "모든 필드를 입력해주세요" });
    }

    if (name.length > MAX_FIELD_LENGTH || organization.length > MAX_FIELD_LENGTH ||
        phone.length > 20 || message.length > 2000) {
      return jsonResponse(400, { success: false, message: "입력값이 너무 깁니다" });
    }

    if (!/^[\d\-]+$/.test(phone)) {
      return jsonResponse(400, { success: false, message: "올바른 연락처를 입력해주세요" });
    }

    var cache = CacheService.getScriptCache();
    var cacheKey = "rate_" + phone.replace(/\D/g, "");
    if (cache.get(cacheKey)) {
      return jsonResponse(429, { success: false, message: "잠시 후 다시 시도해주세요" });
    }
    cache.put(cacheKey, "1", RATE_LIMIT_SECONDS);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),
      name.substring(0, MAX_FIELD_LENGTH),
      organization.substring(0, MAX_FIELD_LENGTH),
      "'" + phone.substring(0, 20),
      message.substring(0, 2000),
      "신규",
    ]);

    return jsonResponse(200, { success: true });
  } catch (err) {
    return jsonResponse(500, { success: false, message: "서버 오류가 발생했습니다" });
  }
}

function jsonResponse(status, body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
