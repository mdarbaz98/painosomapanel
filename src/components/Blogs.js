import React, { useState, useEffect, useRef } from "react";
import { Editor } from 'primereact/editor';
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { apiService } from "../service/apiServices";
import { imageService } from "../service/imageService";
import { Calendar } from 'primereact/calendar';
import Axios from "axios";
import classNames from "classnames";
import { Accordion, AccordionTab } from 'primereact/accordion';

function Blogs() {
    let emptyBlog = {
       id: "",
       blog_title: "",
       seo_title: "",
       slug: "",
       author_id :"",
       review_id :"",
       feature_image :"",
       parentcategory_id: null,
       subcategory_id :"",
       blogdate:"",
       status:"",
       publishdate:"",
       content:""
    };

    const [blogs, setBlogs] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [galleryDialog, setGalleryDialog] = useState(false);
    const [blog, setBlog] = useState(emptyBlog);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [gallery, setGallery] = useState(null);
    const [images, setImages] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const fileRef = useRef(null);
    const [parentCategory, setParentCategory] = useState([null]);
    const [subCategory, setSubCategory] = useState([{name: "none",value: "0"}]);

    async function fetchData() {
        const blogData = new apiService();
        blogData.getBlog().then((data) => setBlogs(data));
    }
    async function fetchImages() {
        const galleryImages = new apiService();
        galleryImages.getImages().then((data) => setGallery(data));
    }

    // useEffect(() => {

    // }, []);

    useEffect(() => {
        console.log('h')
        getsubCategory();
    }, [blog.parentcategory_id]);

    async function getParentCategory() {
        const blogCategory = new apiService();
        const res = await blogCategory.getParentCategory();
        const output = res.map((data) => ({ name: data.cat_name, value: `${data.id}` }))
        setParentCategory([...output]);
    }

    async function getsubCategory() {
       const res1 = await Axios.get(`http://localhost:5000/api/category/subcategory/${blog.parentcategory_id}`);
        const output = res1.data.map((data) => ({ name: data.cat_name, value: `${data.id}` }))
        setSubCategory([...output]);
    }

    fetchData();
    fetchImages();
    getParentCategory();


    const onImageChange = (e) => {
        let selectedImages = [...images];
        if (e.checked) selectedImages.push(e.value);
        else selectedImages.splice(selectedImages.indexOf(e.value), 1);

        setImages(selectedImages);
    };

    const openNew = () => {
        setBlog(emptyBlog);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openImageGallery = () => {
        setGalleryDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const hideGalleryDialog = () => {
        setGalleryDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);
        if (blog.blog_title.trim()) {
            let _blogs = [...blogs];
            let _blog = { ...blog };
            if (blog.id) {
                const index = findIndexById(blog.id);

                _blogs[index] = _blog;
                updateBlogFunction(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Updated", life: 3000 });
            } else {
                //   _blog.id = createId();
                addBlogFunction(_blog);
                // _blogs.push(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Created", life: 3000 });
            }

            setBlogs(_blogs);
            setProductDialog(false);
            setBlog(emptyBlog);
        }
    };

    const addBlogFunction = async (data) => {
        var createPost = {
            id: data.id,
            blog_title: data.blog_title,
            seo_title: data.seo_title,
            slug: data.slug,
            author_id :data.author_id,
            review_id :data.review_id,
            feature_image :data.feature_image,
            parentcategory_id:data.parentcategory_id,
            subcategory_id :data.subcategory_id,
            blogdate:data.blogdate,
            status:data.status,
            publishdate:data.publishdate,
            content:data.content
        };

        await Axios.post("http://localhost:5000/api/blog", createPost);
        setImages([]);
        fetchData();
    };

    const updateBlogFunction = async (data) => {
        const newImg = images.length > 0 ? images.toString() : data.image;

        var updatePost = {
            id: data.id,
            blog_title: data.blog_title,
            seo_title: data.seo_title,
            slug: data.slug,
            author_id :data.author_id,
            review_id :data.review_id,
            feature_image :data.feature_image,
            parentcategory_id:data.parentcategory_id,
            subcategory_id :data.subcategory_id,
            blogdate:data.blogdate,
            status:data.status,
            publishdate:data.publishdate,
            content:data.content
        };

        await Axios.put(`http://localhost:5000/api/blog/${data.id}`, updatePost);
        setImages([]);
        fetchData();
    };

    const editProduct = (blog) => {
        console.log(blog)
        setBlog({ ...blog });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (blog) => {
        setBlog(blog);
        setDeleteProductDialog(true);
        // deleteBlogFunction(blog.id);
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

    const exportCSV = () => {
        dt.current.exportCSV();
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

    const onInputChange = (e, name) => {
        let val;
        name === "content" ? (val = e.htmlValue || "") : (val = (e.target && e.target.value) || "");

        let _blog = { ...blog };
        _blog[`${name}`] = val;
        setBlog(_blog);
    };
    console.log(blog)
    const onUpload = () => {
        toast.current.show({ severity: "info", summary: "Successfully", detail: "File Added", life: 3000 });
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

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
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
    const authoridTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.author_id}
            </>
        );
    };
    const review_idTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.review_id}
            </>
        );
    };
    const featureimageTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.feature_image}
            </>
        );
    };
    const parentcategory_idTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.parentcategory_id}
            </>
        );
    };
    const subcategory_idTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.subcategory_id}
            </>
        );
    };
    const statusTemplate = (rowData) => {
        return (
            <>

            </>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Blogs</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
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


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <h5>blog Page</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={blogs}
                        selection={selectedBlogs}
                        onSelectionChange={(e) => setSelectedBlogs(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
                        globalFilter={globalFilter}
                        emptyMessage="No blogs found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="blog_title" header="Title" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="author_id" header="Author_id" sortable body={authoridTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="review_id" header="Review_id" sortable body={review_idTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="feature_image" header="Feature_image" sortable body={featureimageTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="parentcategory_id" header="Parentcategory_id" sortable body={parentcategory_idTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="subcategory_id" header="Subcategory_id" sortable body={subcategory_idTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="status" header="Status" sortable body={statusTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "1200px" }} header="Manage blog" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {blog.feature_img && <img src={`assets/demo/images/blogs/${blog.feature_img}`} alt={blog.feature_img} width="250" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <form className="grid p-fluid">
                            <div className="col-12 md:col-8">
                                <div className="card p-fluid">
                                    <h5>Content</h5>
                                    <Editor style={{ height: '320px' }} value={blog.content} onTextChange={(e) => onInputChange(e, "content")} />
                                </div>
                            </div>

                            <div className="col-12 md:col-4">
                                {/* titlesection  */}
                                <Accordion>
                                    <AccordionTab header="Blog Section">
                                        <div className=" p-field pt-3 mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="blog_title" value={blog.blog_title} onChange={(e) => onInputChange(e, "blog_title")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="blog_title">Blog title</label>
                                            </span>
                                        </div>
                                        <div className=" p-field pt-3 mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="seo_title" value={blog.seo_title} onChange={(e) => onInputChange(e, "seo_title")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="seo_title">SEO title</label>
                                            </span>
                                        </div>
                                        <div className=" p-field pt-3">
                                            <span className="p-float-label">
                                                <InputText type="text" id="blog_slug" value={blog.slug} onChange={(e) => onInputChange(e, "slug")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="blog_slug">Blog slug</label>
                                            </span>
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                                {/* titlesection */}
                               {/* imagesection */}
                               <Accordion>
                                    <AccordionTab header="Image Section">
                                        <TabView>
                                            <TabPanel header="upload">
                                                <FileUpload auto ref={fileRef} url="http://localhost:5000/api/image" className="mb-5" name="image" onUpload={onUpload} accept="image/*" maxFileSize={1000000} />
                                            </TabPanel>
                                            <TabPanel header="Gallery">
                                                <Button label="select image" icon="pi pi-check" iconPos="right" onClick={openImageGallery} />
                                                <div className="grid">
                                                {images?.map((item, ind) => {
                                                    return (
                                                        <div className="col" key={ind}>
                                                            <img src={`assets/demo/images/gallery/${item}`} alt={item} style={{width:"100%"}} className="my-3 mx-auto block shadow-2" />
                                                        </div>
                                                    );
                                                })}
                                                </div>
                                            </TabPanel>
                                        </TabView>
                                    </AccordionTab>
                                </Accordion>
                                {/* imagesection */}

                                 {/* categorydropdwon */}
                                <Accordion>
                                    <AccordionTab header="Category Section">
                                    <Dropdown
                                        options={parentCategory}
                                        value={blog.parentcategory_id}
                                        onChange={(e) => onInputChange(e, "parentcategory_id")}
                                        className={classNames({ "p-invalid": submitted && !blog.parentcategory_id },"mb-5")}
                                        placeholder="Select parent category"
                                        optionLabel="name">
                                    </Dropdown>

                                    <MultiSelect
                                        options={subCategory}
                                        value={blog.subcategory_id}
                                        onChange={(e) => onInputChange(e, "subcategory_id")}
                                        optionLabel="name"
                                        placeholder="Select a category"
                                        display="chip"
                                    />
                                    </AccordionTab>
                                </Accordion>
                                {/* categorydropdwon */}
                                {/* authordropdown */}
                                <Accordion>
                                    <AccordionTab header="Author Section">
                                    <Dropdown
                                        options={parentCategory}
                                        value={blog.parentcategory_id}
                                        onChange={(e) => onInputChange(e, "parentcategory_id")}
                                        className={classNames({ "p-invalid": submitted && !blog.parentcategory_id })}
                                        placeholder="Author id"
                                        optionLabel="name">
                                    </Dropdown>

                                    <MultiSelect
                                        options={subCategory}
                                        value={blog.subcategory_id}
                                        onChange={(e) => onInputChange(e, "subcategory_id")}
                                        optionLabel="name"
                                        placeholder="Review id"
                                        display="chip"
                                    />
                                    <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <Calendar id="basic" value={blog.blogdate} onChange={(e) => onInputChange(e, "blogdate")} />
                                                <label htmlFor="keywords">Blog date</label>
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


                    <Dialog visible={galleryDialog} style={{ width: "1200px" }} header="Gallery" modal  onHide={hideGalleryDialog}>
                    <div className="grid">
                            {gallery && gallery ? gallery?.map((item, index) => {
                                return (
                                    <div className="col-12 md:col-2" key={index}>
                                        <Checkbox className="cursor-pointer" inputId={`cb3${index}`} value={`${item.image}`} onChange={onImageChange} checked={images.includes(`${item.image}`)}></Checkbox>
                                        <label htmlFor={`cb3${index}`} className="p-checkbox-label">
                                            <img src={`assets/demo/images/gallery/${item.image}`} alt={item.alt_title} style={{width: "100%",height: "200px",objectFit: "cover",cursor: "pointer"}}  className="mt-0 mx-auto mb-5 block shadow-2" />
                                        </label>
                                    </div>
                                );
                            }) : <p>No images </p>}
                        </div>
                    </Dialog>

                    {/* image  gallery dialog  */}
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Blogs, comparisonFn);
