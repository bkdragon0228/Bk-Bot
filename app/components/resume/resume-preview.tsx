const RESUME_CONTENT = `
여기에 이력서 내용을 넣으시면 됩니다.
경력, 기술 스택 등의 정보를 포함하면 됩니다.
`;

export default function ResumePreview() {
    return (
        <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">{RESUME_CONTENT}</pre>
        </div>
    );
}
