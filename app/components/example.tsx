export function ExampleComponent() {
    return (
        <div className="container-wrapper">
            <h1 className="heading-1">제목</h1>
            <div className="card p-6">
                <h2 className="heading-2">카드 제목</h2>
                <p className="paragraph">이 텍스트는 자동으로 라이트/다크 모드에 맞춰집니다.</p>
                <input type="text" className="input mt-4" placeholder="입력해주세요" />
                <div className="flex gap-4 mt-4">
                    <button className="button button-primary px-4 py-2">주요 버튼</button>
                    <button className="button button-secondary px-4 py-2">보조 버튼</button>
                </div>
            </div>
        </div>
    );
}
