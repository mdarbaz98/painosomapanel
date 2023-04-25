import React, { useState,useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import Axios from "axios";



function AddBlog() {
    let blog = {
        blog_title: '',
        seo_title: '',
        blog_slug: '',
        keywords: '',
        meta_desc: '',
        author_name: '',
        alt_title: '',
        img_title: '',
        category: '',
        excerpt: '',
    };

    const categories = [
        { name: "Anxiety", value: "anxiety" },
        { name: "Healthy Lifestyle", value: "healthylifestyle" },
        { name: "none", value: "0" },
    ];

    const [blogData, setBlogData] = useState(blog);
    const [content, setContent] = useState("<p>Hello World!</p>");
    // const [value1, setValue1] = useState("");
    const [file, setFile] = useState(null)

    const toast = useRef(null);
    const fileRef = useRef(null)

    const myUploader = (event) => {
        // event.files == files to upload
        toast.current.show({ severity: 'info', summary: 'Successfully', detail: 'File Added', life: 3000 });
        setFile(event.files[0]);
        // console.log(event.files[0])
    }

    const submitForm = async (e) => {
        e.preventDefault();
         const formData = new FormData();
         formData.append('blogTitle',blogData.blog_title);
         formData.append('seo_title',blogData.seo_title);
         formData.append('blog_slug',blogData.blog_slug);
         formData.append('keywords',blogData.keywords);
         formData.append('meta_desc',blogData.meta_desc);
         formData.append('author_name',blogData.author_name);
         formData.append('image',file);
         formData.append('alt_title',blogData.alt_title);
         formData.append('img_title',blogData.img_title);
         formData.append('category',blogData.category);
         formData.append('excerpt',blogData.excerpt);

        await Axios.post('http://192.168.0.143:5000/api/blog',formData).then().catch(err => console.log(err));
        setBlogData(blog);
        fileRef.current.clear();
        toast.current.show({ severity: 'success', summary: 'Successfully', detail: 'Blog Added', life: 3000 });
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _blog = { ...blogData };
        _blog[`${name}`] = val;
        setBlogData(_blog);
    };

    return (
        <form className="grid card p-fluid">
            <div className="col-12 md:col-8">
                <div className="card p-fluid">
                    <h5>Content</h5>
                    <Editor style={{ height: "320px" }} value={content} onTextChange={(e) => setContent(e.htmlValue)} />
                </div>
            </div>

            <div className="col-12 md:col-4">
                <div className="card p-fluid">
                    <h5 className="mb-5">Blog Section</h5>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.blog_title} onChange={(e) => onInputChange(e,"blog_title")} />
                            <label htmlFor="inputtext">blog title</label>
                        </span>
                    </div>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.seo_title} onChange={(e) => onInputChange(e,"seo_title")} />
                            <label htmlFor="inputtext">SEO title</label>
                        </span>
                    </div>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.blog_slug} onChange={(e) => onInputChange(e,"blog_slug")} />
                            <label htmlFor="inputtext">bLog slug</label>
                        </span>
                    </div>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.keywords} onChange={(e) => onInputChange(e,"keywords")} />
                            <label htmlFor="inputtext">keywords</label>
                        </span>
                    </div>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.meta_desc} onChange={(e) => onInputChange(e,"meta_desc")} />
                            <label htmlFor="inputtext">meta desc</label>
                        </span>
                    </div>
                </div>

                <div className="card p-fluid">
                    <h5 className="mb-5">Author Section</h5>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.author_name} onChange={(e) => onInputChange(e,"author_name")} />
                            <label htmlFor="inputtext">author name</label>
                        </span>
                    </div>
                </div>

                <div className="card p-fluid">
                    <h5 className="mb-5">Image Section</h5>
                    <Toast ref={toast} />
                    <FileUpload auto ref={fileRef} className="mb-5" name="image" customUpload uploadHandler={myUploader}  accept="image/*" maxFileSize={1000000} />
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.alt_title} onChange={(e) => onInputChange(e,"alt_title")} />
                            <label htmlFor="inputtext">alt title</label>
                        </span>
                    </div>
                    <div className=" p-field mb-5">
                        <span className="p-float-label">
                            <InputText type="text" id="inputtext" value={blogData.img_title} onChange={(e) => onInputChange(e,"img_title")} />
                            <label htmlFor="inputtext">image title</label>
                        </span>
                    </div>
                </div>
                <div className="card p-fluid">
                    <h5 className="mb-5">Category Section</h5>
                    <Dropdown options={categories} value={blogData.category} onChange={(e) => onInputChange(e,"category")} optionLabel="name"></Dropdown>
                </div>
                <div className="card p-fluid">
                    <h5 className="mb-5">Excerpt Section</h5>
                    <InputTextarea  rows={5} cols={20} value={blogData.excerpt} onChange={(e) => onInputChange(e,"excerpt")} />
                </div>
            <Button label="Save" onClick={submitForm} className="p-button-primary" />
            </div>
        </form>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(AddBlog, comparisonFn);
