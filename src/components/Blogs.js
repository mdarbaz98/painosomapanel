import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { apiService } from "../service/apiServices";
import { Calendar } from "primereact/calendar";
import Axios from "axios";
import classNames from "classnames";
import { Accordion, AccordionTab } from "primereact/accordion";
import { format } from 'date-fns'


function Blogs() {
    let emptyBlog = {
        id: "",
        blog_title: "",
        seo_title: "",
        slug: "",
        blog_desc: "",
        author: "",
        review: "",
        feature_image: "",
        parentcategory: null,
        subcategory: "",
        blogdate: new Date(),
        status: "draft",
        publishdate: "",
        content: "",
        reference: "",
    };

    let emptyFaq = [
        {
            question: "",
            answer: "",
        },
    ]

    const statusOptions = ["publish", "draft", "trash"];

    const [filters2, setFilters2] = useState({
        blog_title: { value: null, matchMode: FilterMatchMode.CONTAINS },
        author: { value: null, matchMode: FilterMatchMode.IN },
        review: { value: null, matchMode: FilterMatchMode.IN },
        parentcategory: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [faq, setFaq] = useState(emptyFaq);

    const [blogs, setBlogs] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [galleryDialog, setGalleryDialog] = useState(false);
    const [galleryDialog2, setGalleryDialog2] = useState(false);
    const [faqDialog, setFaqDialog] = useState(false);
    const [blog, setBlog] = useState(emptyBlog);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [gallery, setGallery] = useState(null);
    const [gallery2, setGallery2] = useState(null);
    const [images, setImages] = useState([]);
    const [images2, setImages2] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const [parentCategory, setParentCategory] = useState([null]);
    const [subCategory, setSubCategory] = useState([{ name: "none", value: "none" }]);
    const [authoroptions, setAuthorOptions] = useState([{ name: "none", value: "none" }]);
    const [file, setFile] = useState(null);
    const [globalFilterValue2, setGlobalFilterValue2] = useState("");
    const [loading2, setLoading2] = useState(true);
    const [titleCount, ChangeTitleCount] = useState(0);
    const [blogCount, ChangeBlogCount] = useState(0);
    const [editorInsert, setEditorInsert] = useState(null);
    const [searchgallery, setSearchGallery] = useState('');



    async function fetchData() {
        const blogData = new apiService();
        await blogData.getBlog().then((data) => {
            const blogsdate = data.map((blog)=>{
                let _dates = {...blog}
                _dates["blogdate"] =   new Date(blog.blogdate)
                return (_dates)
              })
        
              blogsdate.sort(
                (objA, objB) => {
                   return Number(objB.blogdate) - Number(objA.blogdate)}
                )
            setBlogs(blogsdate);
            console.log(blogsdate)
            setLoading2(false);
        });
    }
    async function fetchImages() {
        const galleryImages = new apiService();
        galleryImages.getImages().then((data) => {
            setGallery(data)
            setGallery2(data)
        });
    }

    useEffect(() => {
        getsubCategory();
        fetchData();
        fetchImages();
        getParentCategory();
        getAuthor();
    }, []);

    async function getAuthor() {
        const apiData = new apiService();
        const Authordata = await apiData.getAuthor();
        const result = Authordata.map((data) => ({ name: data.name, value: `${data.name}` }));
        setAuthorOptions([...result]);
    }
    async function getParentCategory() {
        const blogCategory = new apiService();
        const res = await blogCategory.getParentCategory();
        const output = res.map((data) => ({ name: data.cat_name, value: `${data.cat_name}` }));
        setParentCategory([...output]);
    }

    async function getsubCategory() {
        const blogSubCategory = new apiService();
        const res = await blogSubCategory.getSubCategory();
        const output = res.map((data) => ({ name: data.cat_name, value: `${data.cat_name}` }));
        setSubCategory([...output]);
    }

    const newFaq = () => {
        setFaq([...faq, { question: "", answer: "" }]);
    };

    const onImageChange = (e, name) => {
        let selectedImages = [...images];
        if (e.checked) selectedImages.push(e.value);
        else selectedImages.splice(selectedImages.indexOf(e.value), 1);
        setImages(selectedImages);
        onInputChange(e, name, selectedImages);
        setGalleryDialog(false)
        setGalleryDialog2(false)
    };
    const onImageChange2 = (e, name) => {
        let selectedImages = [...images2];
        if (e.checked) selectedImages.push(e.value);
        else selectedImages.splice(selectedImages.indexOf(e.value), 1);
        setImages2(selectedImages);
        onInputChange(e, name, selectedImages);
        setGalleryDialog(false)
    };


    const onGlobalFilterChange2 = (e) => {
        const value = e.target.value;
        let _filters2 = { ...filters2 };
        _filters2["global"].value = value;
        setFilters2(_filters2);
        setGlobalFilterValue2(value);
    };

    const openNew = () => {
        setBlog(emptyBlog);
        setSubmitted(false);
        setProductDialog(true);
        setFile(null);
    };

    const openImageGallery2 = (e) => {
        e.preventDefault();
        setGalleryDialog2(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const hideFaqDialog = () => {
        setFaqDialog(false);
    };
    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const faqCloseDialog = () => {
        setFaqDialog(false);
    };

    const hideGalleryDialog = () => {
        setGalleryDialog(false);
    };
    const hideGalleryDialog2 = () => {
        setGalleryDialog2(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        if (blog.blog_title.trim()) {
            let _blogs = [...blogs];
            let _blog = { ...blog };
            if (blog.id) {
                const index = findIndexById(blog.id);
                _blogs[index] = _blog;
                addupdateBlogFunction(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Updated", life: 3000 });
            } else {
                addupdateBlogFunction(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Created", life: 3000 });
            }

            setBlogs(_blogs);
            setProductDialog(false);
            setBlog(emptyBlog);
        }
    };

    const addupdateBlogFunction = async (data) => {
        const formData = new FormData();
        formData.append("blog_title", data.blog_title);
        formData.append("seo_title", data.seo_title);
        formData.append("slug", data.slug);
        formData.append("blog_desc", data.blog_desc);
        formData.append("author", data.author);
        formData.append("review", data.review);
        formData.append("image[]", file ? file : data.feature_image);
        formData.append("parentcategory", data.parentcategory);
        formData.append("subcategory", data.subcategory);
        formData.append("blogdate", data.blogdate);
        formData.append("status", data.status);
        formData.append("publishdate", data.publishdate);
        formData.append("content", data.content);
        formData.append("reference", data.reference);

        if (blog.id) {
            await Axios.put(`http://localhost:5000/api/blog/${data.id}`, formData);
        } else {
            await Axios.post("http://localhost:5000/api/blog", formData);
        }
        setImages([]);
        setImages2([]);
        fetchData();
        setFile(null);
    };

    const editProduct = (blog) => {
        let _blog = { ...blog };
        if (_blog.parentcategory.includes(",")) {
            var parentCategoryArray = _blog.parentcategory.split(",");
        } else {
            var parentCategoryArray = [];
            parentCategoryArray.push(_blog.parentcategory);
        }
        if (_blog.subcategory.includes(",")) {
            var subCategoryArray = _blog.subcategory.split(",");
        } else {
            var subCategoryArray = [];
            subCategoryArray.push(_blog.subcategory);
        }
        _blog["parentcategory"] = parentCategoryArray;
        _blog["subcategory"] = subCategoryArray;
        _blog["blogdate"] = new Date(blog.blogdate);
        setBlog(_blog);
        setProductDialog(true);
    };

    const confirmDeleteProduct = (blog) => {
        setBlog(blog);
        setDeleteProductDialog(true);
    };

    const deleteBlogFunction = async (data) => {
        let selectedIds = typeof data === "number" ? data : data.map((res) => res.id);
        await Axios.delete(`http://localhost:5000/api/blog/${selectedIds}`).then();
        fetchData();
    };


    const deleteProduct = () => {
        deleteBlogFunction(blog.id);
        setDeleteProductDialog(false);
        setBlog(emptyBlog);
        toast.current.show({ severity: "error", summary: "Successfully", detail: "Blog Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < blogs.length; i++) {
            if (blogs[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };


    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _blogs = blogs.filter((val) => !selectedBlogs.includes(val));
        setBlogs(_blogs);
        deleteBlogFunction(selectedBlogs);
        setDeleteProductsDialog(false);
        setSelectedBlogs(null);
        toast.current.show({ severity: "error", summary: "Successfully", detail: "Blogs Deleted", life: 3000 });
    };

    const onInputChange = (value, name, selectedImages) => {
        let _blog = { ...blog };
        if (name === "feature_image") {
            _blog[`${name}`] = selectedImages;
        } else if (name === "slug") {
            _blog[`${name}`] = value.replace(" ", "-");
        } else {
            _blog[`${name}`] = value;
        }
        setBlog(_blog);
    };

    const handleFaqChange = (index, e) => {
        let _faq = [...faq];
        _faq[index][e.target.name] = e.target.value;
        setFaq(_faq);
    };

    const removeFaq = (index) => {
        let _faq = [...faq];
        _faq.splice(index, 1);
        setFaq(_faq);
    };
    
    const statusItemTemplate = (option) => {
        return <span className={`status-badge status-${option} px-4 py-2 border-round`}>{option}</span>;
    };

    const onImageUpload = async (event) => {
        toast.current.show({ severity: "success", summary: "Successfully", detail: `Image Added Successfully`, life: 3000 });
        fetchImages();
    };


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedBlogs || !selectedBlogs.length} />
                </div>
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.blog_title}
            </>
        );
    };


    
    const dateBodyTemplate = (rowData) => {
        let productDate = new Date(rowData.blogdate);
        const result = format(productDate, 'dd/MM/yyyy')
        return (
            <>{result}</>
        )
    };

    const parentcategory_idTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.parentcategory}
                {rowData.subcategory}
            </>
        );
    };

    const saveFaq = () => {
        const faqData = `<div class="accordion faq" id="accordionExample">
        ${faq?.map((data, ind) => {
            return (
                `
                    <div class="accordion-item">
                    <p class="accordion-header" id="faq${ind}">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${ind}" aria-expanded="true" aria-controls="#collapse${ind}">
                           ${data.question}
                        </button>
                    </p>
                    <div id="collapse${ind}" class="accordion-collapse collapse show" aria-labelledby="faq${ind}" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                           ${data.answer}
                        </div>
                    </div>
                </div>
                `
            );
        })}
      </div>`;
        editorInsert.insertContent(faqData)
        setFaqDialog(false)
        setFaq(emptyFaq)
    }

    const statusRowFilterTemplate = (options) => {
        return <Dropdown value={options.value} options={statusOptions} onChange={(e) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select a Status" className="p-column-filter" showClear />;
    };

    // for review
    const reviewBodyTemplate = (rowData) => {
        const representative = rowData.review;
        return (
            <>
                <span className="image-text">{representative}</span>
            </>
        );
    };

    const reviewItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span className="image-text">{option.name}</span>
            </div>
        );
    };

    const reviewRowFilterTemplate = (options) => {
        return <MultiSelect value={options.value} options={authoroptions} itemTemplate={reviewItemTemplate} onChange={(e) => options.filterApplyCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    // for author
    const authorBodyTemplate = (rowData) => {
        const representative = rowData.author;
        return (
            <>
                <span className="image-text">{representative}</span>
            </>
        );
    };

    const authorItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <span className="image-text">{option.name}</span>
            </div>
        );
    };

    const authorRowFilterTemplate = (options) => {
        return <MultiSelect value={options.value} options={authoroptions} itemTemplate={authorItemTemplate} onChange={(e) => options.filterApplyCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />;
    };

    const statusTemplate = (rowData) => {
        return (
            <>
                <span className={`status-badge status-${rowData.status} px-4 py-2 border-round`}>{rowData.status}</span>
            </>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2 mr-2" onClick={() => confirmDeleteProduct(rowData)} />
                <Button icon="pi pi-eye" className="p-button-rounded p-button-success mt-2" />
            </div>
        );
    };

    const imageClick = (e) => {
        editorInsert && editorInsert.insertContent(`<img src="${e.target.src}" />`);
        setEditorInsert(null)
    };

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    const FaqDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={faqCloseDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveFaq} />
        </>
    );

    console.log(blog)

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Blog Page</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={blogs}
                        selection={selectedBlogs}
                        dataKey="id"
                        paginator
                        rows={25}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        className="p-datatable-customers"
                        filters={filters2}
                        filterDisplay="row"
                        loading={loading2}
                        responsiveLayout="scroll"
                        globalFilterFields={["author", "review", "status"]}
                        emptyMessage="No blogs found."
                        onSelectionChange={(e) => setSelectedBlogs(e.value)}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="blog_title" header="Title" filter filterPlaceholder="Search by Title" body={nameBodyTemplate} headerStyle={{ width: "17%", minWidth: "17rem" }}></Column>
                        <Column field="author" header="Author" filterPlaceholder="Search by author" body={authorBodyTemplate} filter filterElement={authorRowFilterTemplate} headerStyle={{ width: "17%", minWidth: "17rem" }}></Column>
                        <Column field="review" header="Review" filterPlaceholder="Search by review" body={reviewBodyTemplate} filter filterElement={reviewRowFilterTemplate} headerStyle={{ width: "17%", minWidth: "17rem" }}></Column>
                        <Column field="blogdate" header="Date"  body={dateBodyTemplate} headerStyle={{ width: "10%", minWidth: "10rem" }}></Column>
                        <Column field="parentcategory" header="Parentcat" filter filterPlaceholder="Search by Category" body={parentcategory_idTemplate} headerStyle={{ width: "17%", minWidth: "17rem" }}></Column>
                        <Column field="status" header="Status" filter filterPlaceholder="Search by status" body={statusTemplate} showFilterMenu={false} filterElement={statusRowFilterTemplate} headerStyle={{ width: "17    %", minWidth: "17    rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "100%",maxHeight:"100vh" }} modal className="p-fluid blogmodal" footer={productDialogFooter}>
                        <form className="grid p-fluid">
                            <div className="col-12 md:col-8">
                                <Editor
                                    apiKey="crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb"
                                    className="editor"
                                    style={{ width: "100%" }}
                                    inline={false} // default false
                                    tagName="div" // only inline
                                    textareaName="article"
                                    outputFormat="html" // html (default) / text
                                    tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                    value={blog.content}
                                    init={{
                                        height: 580,
                                        resize: true, // true/false/'both'
                                        branding: true,
                                        statusbar: true,
                                        placeholder: "",
                                        paste_data_images: true, // default false
                                        paste_webkit_styles: "all",
                                        font_formats:
                                            "Oswald=oswald; Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                                        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                                        plugins: ["quickbars","advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                        setup: function (editor) {
                                            editor.ui.registry.addButton("addFaq", {
                                                text: "Add FAQ",
                                                onAction: () => {
                                                    setEditorInsert(editor);
                                                    setFaqDialog(true);
                                                },
                                            });
                                            editor.ui.registry.addButton("Gallery", {
                                                text: "Gallery",
                                                onAction: () => {
                                                    setGalleryDialog(true);
                                                    setEditorInsert(editor);
                                                },
                                            });
                                        },
                                        toolbar:"Gallery | addFaq | undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                        quickbars_selection_toolbar: 'bold italic | formatselect | quicklink blockquote',
                                        media_dimensions: false,
                                        media_url_resolver: function (data, resolve /*, reject*/) {
                                            if (data.url.startsWith("https://www.youtube.com/watch/") !== -1) {
                                                const v = data.url.slice(data.url.indexOf("?v=") + 3);

                                                var embedHtml = '<div id="fitVids-wrapper"><iframe src="' + "https://www.youtube.com/embed/" + v + '" ></iframe></div>';
                                                resolve({ html: embedHtml });
                                            } else {
                                                resolve({ html: "" });
                                            }
                                        },
                                        file_picker_types: "file image media",
                                        images_upload_handler: async function (blobInfo, success, failure) {
                                            let image = new FormData();
                                            image.append("image", blobInfo.blob());
                                            try {
                                                const { data } = await Axios.post("http://localhost:5000/api/image", image);
                                                success(`assets/demo/images/gallery/${data}`);
                                            } catch (error) {
                                                console.log(error);
                                                return;
                                            }
                                        },

                                        template_selected_content_classes: "selcontent",
                                        templates: [
                                            {
                                                title: "inline template",
                                                description: "Some desc 1",
                                                content: `<p>My <button class="btn">content</button></p>
                                                <p>My <button class="btn">content</button></p>
                                                <p>My <button class="btn">content</button></p>`,
                                            },
                                            {
                                                title: "Simple html file template ",
                                                description: "Some desc 1",
                                                url: "templates/simple.html",
                                            },
                                            {
                                                title: "html file template",
                                                description: "Some desc 2",
                                                url: "templates/development.html",
                                            },
                                        ],
                                    }}
                                    onEditorChange={(e) => {
                                        onInputChange(e, "content");
                                    }}
                                />
                                <Accordion>
                                    <AccordionTab header="Reference Section" className="md:mt-5">
                                        <Editor
                                            init={{
                                                height: 300,
                                                plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                                toolbar:
                                                    "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                            }}
                                            value={blog.reference}
                                            onEditorChange={(e) => {
                                                onInputChange(e, "reference");
                                            }}
                                        />
                                    </AccordionTab>
                                </Accordion>
                            </div>

                            <div className="col-12 md:col-4" style={{height: "600px",overflowY:"scroll"}}>
                                {/* titlesection  */}
                                <Accordion>
                                    <AccordionTab header="Blog Section">
                                        <div className=" p-field pt-3 mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="blog_title" value={blog.blog_title} onChange={(e) => onInputChange(e.target.value, "blog_title")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="blog_title">Blog title</label>
                                            </span>
                                        </div>
                                        <div className=" p-field pt-3 mb-5">
                                            <span className="p-float-label">
                                                <InputText
                                                    type="text"
                                                    id="seo_title"
                                                    value={blog.seo_title}
                                                    onChange={(e) => {
                                                        let countvalue = e.target.value.length;
                                                        ChangeTitleCount(countvalue);
                                                        onInputChange(e.target.value, "seo_title");
                                                    }}
                                                    style={{ fontSize: "12px" }}
                                                />
                                                <label htmlFor="seo_title">SEO title</label>
                                            </span>
                                            <p>{titleCount}/60</p>
                                        </div>
                                        <div className=" p-field pb-3">
                                            <span className="p-float-label">
                                                <InputText type="text" id="blog_slug" value={blog.slug} onChange={(e) => onInputChange(e.target.value, "slug")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="blog_slug">Blog slug</label>
                                            </span>
                                        </div>
                                        <div className=" p-field pt-3 mb-5">
                                            <span className="p-float-label">
                                                <InputText
                                                    type="text"
                                                    id="blog_desc"
                                                    value={blog.blog_desc}
                                                    onChange={(e) => {
                                                        let countvalue = e.target.value.length;
                                                        ChangeBlogCount(countvalue);
                                                        onInputChange(e.target.value, "blog_desc");
                                                    }}
                                                    style={{ fontSize: "12px" }}
                                                />
                                                <label htmlFor="blog_desc">Blog description</label>
                                            </span>
                                            <p>{blogCount}/160</p>
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                                {/* titlesection */}
                                {/* imagesection */}
                                <Accordion>
                                    <AccordionTab header="Image Section">
                                        <TabView>
                                            <TabPanel header="upload">
                                                <FileUpload auto url="http://localhost:5000/api/image" className="mb-5" onUpload={onImageUpload} name="image[]" accept="image/*" maxFileSize={1000000} />
                                            </TabPanel>
                                            <TabPanel header="Gallery">
                                                <Button label="select image" icon="pi pi-check" iconPos="right" onClick={(e) => openImageGallery2(e)} />
                                                {images2?.map((item, ind) => {
                                                    return (
                                                        <div className="col" key={ind}>
                                                            <img src={`assets/demo/images/gallery/${item}`} alt={item} width="250" className="mt-0 mx-auto mb-5 block shadow-2" />
                                                        </div>
                                                    );
                                                })}
                                            </TabPanel>
                                        </TabView>
                                    </AccordionTab>
                                </Accordion>
                                {/* imagesection */}

                                {/* categorydropdwon */}
                                <Accordion>
                                    <AccordionTab header="Category Section">
                                        <MultiSelect options={parentCategory} className="mb-5" value={blog.parentcategory} onChange={(e) => onInputChange(e.target.value, "parentcategory")} optionLabel="name" placeholder="Select a parent category" display="chip" />
                                        <MultiSelect options={subCategory} value={blog.subcategory} onChange={(e) => onInputChange(e.target.value, "subcategory")} optionLabel="name" placeholder="Select a category" display="chip" />
                                    </AccordionTab>
                                </Accordion>
                                {/* categorydropdwon */}
                                {/* authordropdown */}
                                <Accordion>
                                    <AccordionTab header="Author Section">
                                        <Dropdown options={authoroptions} value={blog.author} onChange={(e) => onInputChange(e.target.value, "author")} className={classNames({ "p-invalid": submitted && !blog.author }, "mb-5")} placeholder="Author Name" optionLabel="name"></Dropdown>

                                        <Dropdown options={authoroptions} value={blog.review} onChange={(e) => onInputChange(e.target.value, "review")} className={classNames({ "p-invalid": submitted && !blog.review }, "mb-5")} placeholder="Reviewer Name" optionLabel="name"></Dropdown>
                                    </AccordionTab>
                                </Accordion>
                                <Accordion>
                                    <AccordionTab header="publish Section">
                                        <Dropdown options={statusOptions} itemTemplate={statusItemTemplate} value={blog.status} onChange={(e) => onInputChange(e.target.value, "status")} className={classNames({ "p-invalid": submitted && !blog.status }, "mb-5")} placeholder="Select status"></Dropdown>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <Calendar id="date" value={blog.blogdate} onChange={(e) => onInputChange(e.target.value, "blogdate")} />
                                                <label htmlFor="date">Blog date</label>
                                            </span>
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                                {/* authordropdown */}
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {blog && (
                                <span>
                                    Are you sure you want to delete <b>{blog.blog_title}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {blog && <span>Are you sure you want to delete the selected blogs?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={galleryDialog} style={{ width: "100%" }} header="Gallery" modal onHide={hideGalleryDialog}>
                        <div className="grid">
                            {gallery && gallery ? (
                                gallery?.map((item, index) => {
                                    return (
                                        <div className="col-12 md:col-2" key={index}>
                                            <Checkbox className="cursor-pointer" inputId={`cb3${index}`} value={`${item.image}`} onChange={(e) => onImageChange(e, "feature_image")} checked={images.includes(`${item.image}`)}></Checkbox>
                                            <label htmlFor={`cb3${index}`} className="p-checkbox-label">
                                                <img
                                                    onClick={(e) => {
                                                        imageClick(e);
                                                    }}
                                                    src={`assets/demo/images/gallery/${item.image}`}
                                                    alt={item.alt_title}
                                                    style={{ width: "100%", height: "200px", objectFit: "cover", cursor: "pointer" }}
                                                    className="mt-0 mx-auto mb-5 block shadow-2"
                                                />
                                            </label>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No images </p>
                            )}
                        </div>
                    </Dialog>

                    {/* image  gallery dialog  */}

                    {/* gallery for feature_image  */}
                    <Dialog visible={galleryDialog2} style={{ width: "100%" }} header="Gallery" modal onHide={hideGalleryDialog2}>
                        <div className="col-12 mb-5 mt-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText value={searchgallery} onChange={(e) => setSearchGallery(e.target.value)} placeholder="Search" />
                            </span>
                        </div>
                        <div className="grid">
                            {gallery2 && gallery2 ? (
                                gallery2?.filter((image)=>{
                                    return(image.title.toLowerCase().includes(searchgallery.toLowerCase()))
                                   }).map((item, index) => {
                                    return (
                                        <div className="col-12 md:col-2" key={index}>
                                            <Checkbox className="cursor-pointer" inputId={`cb3${index}`} value={`${item.image}`} onChange={(e) => onImageChange2(e, "feature_image")} checked={images2.includes(`${item.image}`)}></Checkbox>
                                            <label htmlFor={`cb3${index}`} className="p-checkbox-label">
                                                <img
                                                    onClick={(e) => {
                                                        imageClick(e);
                                                    }}
                                                    src={`assets/demo/images/gallery/${item.image}`}
                                                    alt={item.alt_title}
                                                    style={{ width: "100%", height: "200px", objectFit: "cover", cursor: "pointer" }}
                                                    className="mt-0 mx-auto mb-5 block shadow-2"
                                                />
                                            </label>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No images</p>
                            )}
                        </div>
                    </Dialog>
                    {/* image  gallery dialog  */}

                    {/* faq dialog */}

                    <Dialog visible={faqDialog} style={{ width: "650px" }} header="Faq" footer={FaqDialogFooter} modal onHide={hideFaqDialog}>
                        {faq?.map((item, index) => {
                            return (
                                <div className="p-fluid card" key={index}>
                                    <div className=" p-field pt-3 mb-5">
                                        <span className="p-float-label">
                                            <InputText
                                                type="text"
                                                value={item.question}
                                                onChange={(e) => {
                                                    handleFaqChange(index, e);
                                                }}
                                                name="question"
                                                id="Question"
                                                style={{ fontSize: "12px" }}
                                            />
                                            <label htmlFor="Answer">Question</label>
                                        </span>
                                    </div>
                                    <div className=" p-field pt-3 mb-5">
                                        <span className="p-float-label">
                                            <InputTextarea
                                                rows={5}
                                                cols={30}
                                                value={item.answer}
                                                name="answer"
                                                onChange={(e) => {
                                                    handleFaqChange(index, e);
                                                }}
                                            />
                                            <label htmlFor="Answer">Answer</label>
                                        </span>
                                    </div>
                                    {index > 0 && (
                                        <div className="p-field">
                                            <Button className="p-button-danger" label="Delete" icon="pi pi-trash" style={{ width: "fit-content" }} onClick={removeFaq} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <Button label="Add More" onClick={newFaq} icon="pi pi-plus" />
                    </Dialog>

                    {/* faq dialog */}
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Blogs, comparisonFn);
