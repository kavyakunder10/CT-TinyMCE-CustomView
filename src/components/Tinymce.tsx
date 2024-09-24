import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useProductDescription } from '../hooks/use-production-description';
import { useApplicationContext, useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import { useUpdateProductDescription } from '../hooks/use-update-product-description';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { usePublishProduct } from '../hooks/use-publish-product';
export default function TinyEditor() {
    const context1 = useCustomViewContext();
    const productId = context1.hostUrl.split("products/")[1]
    // const hardcodedProductId = '9eb16815-46ae-4500-96b2-6a961bc61845';
    const context = useApplicationContext();
    const locale = context?.dataLocale || '';
    const { productDescription, productVersion, loading, error } = useProductDescription(productId, locale);
    const { updateDescription, loading: updating, error: updateError } = useUpdateProductDescription(); 
    const { publish, loading: publishLoading, error: publishError } = usePublishProduct();  // Use the publish hook
    console.log("===",publishError)
    const [editorContent, setEditorContent] = useState('');
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);  
    const [showErrorNotification, setShowErrorNotification] = useState(false); 
    const [showPublishSuccess, setShowPublishSuccess] = useState(false);  // Publish success notification
    const [showPublishError, setShowPublishError] = useState(false);      // Publish error notification


    useEffect(() => {
        if (productDescription) {
            setEditorContent(productDescription);
        }
    }, [productDescription]);


    const handleEditorChange = (content: string) => {
        setEditorContent(content);
    };


    const handleSave = async () => {
        if (productVersion !== undefined) {  
            try {
                await updateDescription(productId, productVersion, locale, editorContent);  
                setShowSuccessNotification(true);
                setShowErrorNotification(false);  
            } catch (err) {
                console.error(err);
                setShowErrorNotification(true); 
                setShowSuccessNotification(false);
            }
        } else {
            console.error('Product version is undefined.');
            setShowErrorNotification(true);
            setShowSuccessNotification(false);
        }
    };
    const handlePublish = async () => {
        if (productVersion !== undefined) {
            try {
                const result = await publish(productId, productVersion);  // Call publish mutation
                console.log("Publish result:", result);  // Log the result for debugging
                setShowPublishSuccess(true);
                setShowPublishError(false);
                setTimeout(() => {
                    window.parent.location.reload();  
                }, 1000);
            } catch (err) {
                console.error("Publish error:",err);  // Log the detailed error
                setShowPublishError(true);
                setShowPublishSuccess(false);
            }
        } else {
            console.error('Product version is undefined.');
            setShowPublishError(true);
            setShowPublishSuccess(false);
        }
    };

    if (loading || updating || publishLoading) return <div>Loading...</div>;
    if (error || updateError || publishError) return <div>Error loading, updating, or publishing product</div>;

    return (
        <>
            <h4 style={{marginBottom:"10px"}}>Product Description</h4>
            {/* Show success notification */}
            {showSuccessNotification && (
                <div style={{padding:"10px 0 10px 0"}}>
                <ContentNotification  type="success" onRemove={() => setShowSuccessNotification(false)}>
                    Product description updated successfully!
                </ContentNotification>
                </div>
            )}

            {/* Show error notification */}
            {showErrorNotification && (
                <div style={{ padding:"10px 0 10px 0"}}>
                <ContentNotification type="error" onRemove={() => setShowErrorNotification(false)}>
                    Failed to update product description. Please try again.
                </ContentNotification>
                </div>
            )}
            {/* Show success notification for publish */}
            {showPublishSuccess && (
                <div style={{ padding: "10px 0 10px 0" }}>
                    <ContentNotification type="success" onRemove={() => setShowPublishSuccess(false)}>
                        Product published successfully!
                    </ContentNotification>
                </div>
            )}

            {/* Show error notification for publish */}
            {showPublishError && (
                <div style={{ padding: "10px 0 10px 0" }}>
                    <ContentNotification type="error" onRemove={() => setShowPublishError(false)}>
                        Failed to publish product. Please try again.
                    </ContentNotification>
                </div>
            )}
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
            <PrimaryButton
            style={{marginTop:"10px"}}
                label="Save"
                onClick={handleSave}
                isDisabled={false}
            />

            <PrimaryButton
                style={{ marginTop: "10px", marginLeft: "10px", backgroundColor:"green" }}
                label={showPublishSuccess?"Published":"Publish"}
                onClick={handlePublish}
                isDisabled={false}
            />
            
        </>
    );
}
