import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { useProductDescription } from '../hooks/use-production-description';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';


export default function TinyEditor() {
    // Fetch productId from the URL
    const productId = window.location.href.split('/').pop() || '';
    // const hardcodedProductId = '9eb16815-46ae-4500-96b2-6a961bc61845';
    const context = useApplicationContext();

    const locale=context?.dataLocale|| ''

    const { productDescription, loading, error } = useProductDescription(productId,locale); 

    const [editorContent, setEditorContent] = useState(''); 

   
    useEffect(() => {
        if (productDescription) {
            setEditorContent(productDescription);  
        }
    }, [productDescription]);


    const handleEditorChange = (content: string) => {
        setEditorContent(content);
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product description</div>;

    return (
        <>
            <h4>Product Description</h4>
            <Editor
                apiKey="ny5v4ltgkfef1txqx9nyhhb6q719gpwbkxrgc9ilxlu846d1"
                init={{
                    plugins: [
                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                }}
                value={editorContent} 
                onEditorChange={handleEditorChange} 
            />
            <button onClick={() => console.log(editorContent)} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Submit
            </button>
        </>
    );
}
