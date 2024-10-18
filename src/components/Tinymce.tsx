import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { useApplicationContext, useCustomViewContext } from '@commercetools-frontend/application-shell-connectors';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import axios from 'axios';
import { useProductDescriptionAndAttributes } from '../hooks/use-production-description/use-product-description';
import { fetchSelectedAttributes, saveSelectedAttributesToCustomObject } from '../utils/custom-object-service';
import { useUpdateProductDescription } from '../hooks/use-update-product-description';
import { useUpdateProductAttributes } from '../hooks/use-update-product-description/use-update-product-attributes';
import { usePublishProduct } from '../hooks/use-publish-product';
import { ContentNotification } from '@commercetools-uikit/notifications';


interface Attribute {
    name: string;
    type?: {  // Make 'type' optional
        name: string;
    };
    label?: {  // Make 'label' optional
        [key: string]: string;
    };
    value: any;
    variantId?: number;
}
interface CustomApplicationRuntimeEnvironment {
    apiUrl: string;
    projectKey:string;
    authUrl:string
    clientId:string
    clientSecret:string
}

export default function TinyEditor() {


    const context1 = useCustomViewContext();
    // const productId = context1.hostUrl.split("products/")[1]
    const productId = '9eb16815-46ae-4500-96b2-6a961bc61845';
    const context = useApplicationContext();
    console.log(context)
    const API_URL = useApplicationContext(
        (context) => (context.environment as unknown as CustomApplicationRuntimeEnvironment).apiUrl
    );
    const PROJECT_KEY = useApplicationContext(
        (context) => (context.environment as unknown as CustomApplicationRuntimeEnvironment).projectKey
    );
    const AUTH_URL = useApplicationContext(
        (context) => (context.environment as unknown as CustomApplicationRuntimeEnvironment).authUrl
    );
    const CLIENT_ID = useApplicationContext(
        (context) => (context.environment as unknown as CustomApplicationRuntimeEnvironment).clientId
    );
    const SECRET_ID = useApplicationContext(
        (context) => (context.environment as unknown as CustomApplicationRuntimeEnvironment).clientSecret
    );

    console.log(API_URL,PROJECT_KEY,AUTH_URL)
    const locale = context?.dataLocale || '';
    const { productDescription, productAttributes, loading, error ,productVersion:version} =
        useProductDescriptionAndAttributes(productId, locale);
    const { updateDescription} = useUpdateProductDescription();
    const { updateAttributes } = useUpdateProductAttributes();
    const { publish } = usePublishProduct();
    const [showSettings, setShowSettings] = useState(false);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: boolean }>({});
    const [attributeEditorContent, setAttributeEditorContent] = useState<{ [key: string]: string }>({});
    const [descriptionContent, setDescriptionContent] = useState<string>('');  // For product description editor

    const [attributes, setAttributes] = useState<Attribute[]>([]); 
    const [latestVersion, setLatestVersion] = useState<number | undefined>(version);
    const [succesMessage,setSuccessMessage]=useState(false)

    useEffect(() => {
        // Only set initial value once, when productDescription is first loaded
        if (productDescription && descriptionContent === '') {
            setDescriptionContent(productDescription);  // Set initial description content only once
        }
    }, [productDescription]);


    useEffect(() => {
        if (productAttributes && Object.keys(attributeEditorContent).length === 0) {
            const initialContent = productAttributes.reduce((acc: { [key: string]: string }, attr: any) => {
                if (!attributeEditorContent[attr.name]) { 
                    acc[attr.name] = attr.value || ''; 
                }
                return acc;
            }, {});
            if (Object.keys(initialContent).length > 0) {
                setAttributeEditorContent(prevState => ({
                    ...prevState,
                    ...initialContent, 
                }));
            }
        }
    }, [productAttributes, attributeEditorContent]);


    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            fetchSelectedAttributes(authToken, productId)
                .then(savedAttributes => setSelectedAttributes(savedAttributes))
                .catch(error => console.error(error));
        }
    }, []);


    useEffect(() => {
        if (Object.keys(selectedAttributes).length > 0) {
            const authToken = localStorage.getItem('authToken');
            if (authToken) {
                saveSelectedAttributesToCustomObject(authToken, productId, selectedAttributes)
                    .then(() => console.log('Attributes saved successfully'))
                    .catch(error => console.error(error));
            }
        }
    }, [selectedAttributes]);

    useEffect(() => {
        setLatestVersion(version); // Sync version when it changes
    }, [version]);

    const handleCheckboxChange = (attributeName: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [attributeName]: !prev[attributeName],
        }));
    };

    // Handle editor content change for each attribute
    const handleEditorChange = (attributeName: string, content: string) => {
        setAttributeEditorContent((prev) => ({
            ...prev,
            [attributeName]: content,
        }));
    };

    // Handle editor content change for product description
    const handleDescriptionChange = (content: any) => {
        setDescriptionContent(content);  // Update state when editor content changes
    };
    
    const getAuthToken = () => localStorage.getItem('authToken');

    // Function to fetch the latest product version
    const fetchLatestProductVersion = async () => {
        try {
            const authToken = getAuthToken();
            const response = await axios.get(`${API_URL}/${PROJECT_KEY}/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            const latestVersion = response.data.version; // Assuming the version is in the response data
            console.log("latestversion",latestVersion)
            setLatestVersion(latestVersion);
            return latestVersion;
        } catch (error) {
            console.error('Error fetching latest product version:', error);
        }
    };

    const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
    const handleSave = async () => {
        const defaultVariantId = 1;

        // Collect updated attributes
        const updatedAttributes = Object.keys(selectedAttributes)
            .filter((key) => selectedAttributes[key])
            .map((key) => ({
                name: key,
                value: attributeEditorContent[key],
                variantId: defaultVariantId,
            }));

        if (!latestVersion) {
            console.error('Product version is undefined');
            return;
        }

        try {
            // 1. Update product description
            if (descriptionContent) {
                await updateDescription(productId, latestVersion, locale, descriptionContent);
                console.log('Description updated successfully');
                // Fetch latest version after updating description
                const newVersion = await fetchLatestProductVersion();
                setLatestVersion(newVersion); // Update latest version after the first update
            }

            // 2. Update product attributes
            if (updatedAttributes.length > 0) {
                for (const attribute of updatedAttributes) {
                    // Fetch the latest version before updating each attribute
                    const latestVersionBeforeUpdate = await fetchLatestProductVersion();
                    console.log('Updating attribute:', attribute.name, 'with version:', latestVersionBeforeUpdate);
                    await updateAttributes(productId, latestVersionBeforeUpdate, [attribute]);
                    await delay(1000); // Delay for rate-limiting or ensuring the update is processed
                }

                // Fetch the latest version after all attribute updates
                const finalVersion = await fetchLatestProductVersion();
                setLatestVersion(finalVersion);
            }

            const latestVersionForPublish = await fetchLatestProductVersion(); // Ensure you fetch the latest version for publish
            console.log('Publishing with version:', latestVersionForPublish);
            await publish(productId, latestVersionForPublish);
            console.log('Product description and attributes updated and published successfully');
            setSuccessMessage(true);
        } catch (error) {
            console.error('Error updating product attributes:', error);
        }
    };

  
    useEffect(() => {
        const fetchAuthToken = async () => {
            try {
                const clientId = `${CLIENT_ID}`;  // Replace with your actual client ID
                const clientSecret = `${SECRET_ID}`;  // Replace with your actual client secret

                const response = await axios.post(
                    `${AUTH_URL}/oauth/token?grant_type=client_credentials`,
                    new URLSearchParams({
                        'grant_type': 'client_credentials',
                    }),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
                        }
                    }
                );
                const accessToken = response.data.access_token;
                localStorage.setItem('authToken', accessToken);

            } catch (error) {
                console.error('Error fetching auth token:', error);
            }
        };

        fetchAuthToken();
    }, []);
    useEffect(() => {
        const fetchProductAttributes = async () => {
            try {
                // Retrieve token from localStorage
                const authToken = localStorage.getItem('authToken');
                if (!authToken) {
                    console.error('No token found in localStorage.');
                    return;
                }

                // Make the GET request to fetch product types
                const response = await axios.get(
                    `${API_URL}/${PROJECT_KEY}/product-types/key=main`,
                    {
                        headers: {
                            'Authorization': `Bearer ${authToken}`,  // Pass token here
                        },
                    }
                );

                setAttributes(response.data.attributes);
            } catch (error) {
                console.error('Error fetching product types:', error);
            }
        };

        fetchProductAttributes();
    }, []);  // Empty dependency array to only call this on component mount

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading product attributes...</div>;

    return (
        <>
          {succesMessage &&  <ContentNotification onRemove={()=>{setSuccessMessage(false)}} type="success">
                Description and Attributes Updated Successfully!
            </ContentNotification>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: "10px" }}>                {/* Settings Label */}
                <button
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#007bff',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                    onClick={() => setShowSettings(!showSettings)} // Toggle Settings display
                >
                    {showSettings ? "Click again to edit" : "Settings"}
                </button>
            </div>
            {/* Show dummy content when settings is clicked */}
            {showSettings && (
                <div style={{ marginTop: '20px', padding: '10px' }}>
                    <h4 style={{ marginBottom: "20px" }}>Please select attributes which you want to Edit</h4>

                    {/* Map over the attributes array and filter for type.name === "text" */}
                    {attributes
                        .filter((attribute) => attribute?.type?.name === 'text')  // Use optional chaining for 'type'
                        .map((attribute) => (
                            <CheckboxInput
                                key={attribute.name}
                                value={attribute.name}  // Use attribute name as value
                                onChange={() => handleCheckboxChange(attribute.name)}
                                isChecked={selectedAttributes[attribute.name] || false}
                            >
                                {attribute?.label?.[locale] || attribute?.label?.['en'] || attribute.name}  {/* Safely access label with fallback */}
                            </CheckboxInput>
                        ))
                    }
                </div>
            )}

            {!showSettings && <small style={{ marginBottom: "30px", color: "red" }}>Note:To Edit values for Product Attributes select the attributes from settings</small>}
            {!showSettings && <div>
                <h3 style={{ margin: "20px 0 20px 0" }}>Product Description</h3>
                <Editor
                    apiKey="wfuimxom2tl3bzeesblvkd2cqt9psx48srxnofonkgw38n4k"
                    init={{
                        plugins: [
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                            'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                        ],
                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                        tinycomments_mode: 'embedded',
                        tinycomments_author: 'Author name',
                    }}
                    value={descriptionContent}  // Controlled value prop
                    onEditorChange={handleDescriptionChange}  // Update state when content changes
                />
            </div>}
            {/* Render TinyMCE Editors for each selected attribute */}
            {!showSettings && Object.keys(selectedAttributes)
                .filter((key) => selectedAttributes[key])
                .map((attributeName) => {
                    return (
                    <div key={attributeName}>
                        <h4 style={{ margin: "20px 0 20px 0" }}>{attributeName}</h4>
                        <Editor
                            apiKey="wfuimxom2tl3bzeesblvkd2cqt9psx48srxnofonkgw38n4k"
                            init={{
                                plugins: [
                                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                    'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                ],
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                tinycomments_author: 'Author name',
                            }}
                            value={attributeEditorContent[attributeName] || ''}
                            initialValue={productAttributes?.find(attr => attr.name === attributeName)?.value || ''}
                            onEditorChange={(content) => handleEditorChange(attributeName, content)}
                        />
                    </div>
                )})}


            {!showSettings && <div>
                <PrimaryButton
                    style={{ marginTop: "10px" }}
                    label="Save and Publish"
                    onClick={handleSave}
                    isDisabled={false}
                />
            </div>}
        </>
    );
}
