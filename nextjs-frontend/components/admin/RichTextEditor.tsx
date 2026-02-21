'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <div className="w-full h-[200px] bg-gray-50 border border-gray-200 rounded-xl animate-pulse" /> });

const MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'link'],
        [{ align: [] }],
        ['clean'],
    ],
};

const FORMATS = ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'blockquote', 'link', 'align'];

interface Props {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
    return (
        <div className="admin-quill">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={MODULES}
                formats={FORMATS}
                placeholder={placeholder || 'Start writing...'}
            />
        </div>
    );
}
