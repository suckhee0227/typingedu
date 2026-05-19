import { useContactForm } from "../../hooks/useContactForm";

export default function ContactForm() {
  const { form, onSubmit, submitStatus, setSubmitStatus } = useContactForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  if (submitStatus === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">
          문의가 접수되었습니다
        </h3>
        <p className="text-green-600 mb-4">
          빠른 시일 내에 연락드리겠습니다.
        </p>
        <button
          onClick={() => setSubmitStatus("idle")}
          className="text-sm text-green-700 underline"
        >
          추가 문의하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            담당자 이름 <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="홍길동"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            기관명 <span className="text-red-500">*</span>
          </label>
          <input
            {...register("organization")}
            placeholder="OO학교 / OO학원 / OO기관"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
          {errors.organization && (
            <p className="text-red-500 text-xs mt-1">
              {errors.organization.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          연락처 <span className="text-red-500">*</span>
        </label>
        <input
          {...register("phone")}
          placeholder="010-1234-5678"
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          문의 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="제작하고 싶은 교구나 궁금한 점을 자유롭게 적어주세요."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          {...register("privacyAgree")}
          type="checkbox"
          id="privacyAgree"
          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="privacyAgree" className="text-sm text-gray-600">
          <a href="/privacy" className="text-primary-600 underline" target="_blank" rel="noopener noreferrer">개인정보보호방침</a>에 동의합니다. <span className="text-red-500">*</span>
        </label>
      </div>
      {errors.privacyAgree && (
        <p className="text-red-500 text-xs">{errors.privacyAgree.message}</p>
      )}

      {submitStatus === "error" && (
        <p className="text-red-500 text-sm">
          문의 접수에 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      <button
        type="submit"
        disabled={submitStatus === "loading"}
        className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitStatus === "loading" ? "접수 중..." : "무료 상담 신청하기"}
      </button>
    </form>
  );
}
