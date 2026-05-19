export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-2xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Typing<span className="font-medium text-primary-300">Edu</span>
            </h3>
            <p className="text-sm leading-relaxed">
              자체 엔진 기반 맞춤형 스마트 교구 제작 전문
              <br />
              교육 기관의 철학을 디지털로 구현합니다.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">연락처</h4>
            <ul className="space-y-2 text-sm">
              <li>이메일: ceo@vibeedu.ai</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  포트폴리오
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  가격안내
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div>
            &copy; {new Date().getFullYear()} <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>typingedu</span>. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white transition-colors">
              개인정보보호방침
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
