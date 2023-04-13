import React, { useState, useEffect, useRef } from "react";
import { Editor } from "primereact/editor";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { apiService } from "../service/apiServices";
import { Calendar } from "primereact/calendar";
import Axios from "axios";
import classNames from "classnames";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Image } from 'primereact/image';
 

function Blogs() {
    let emptyBlog = {
        id: "",
        blog_title: "",
        seo_title: "",
        slug: "",
        author: "",
        review: "",
        feature_image: "",
        parentcategory: null,
        subcategory: "",
        blogdate: "",
        status: 0,
        publishdate: "",
        content: "",
    };

    const statusOptions = [{name : 'Publish', value : 'publish'},
    {name : 'Draft', value : 'draft'},
    {name : 'Trash', value : 'trash'}]

    // const [filters2, setFilters2] = useState({
    //     'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    //     'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    //     'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    //     'representative': { value: null, matchMode: FilterMatchMode.IN },
    //     'status': { value: null, matchMode: FilterMatchMode.EQUALS },
    //     'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
    // });

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
    const [parentCategory, setParentCategory] = useState([null]);
    const [subCategory, setSubCategory] = useState([{ name: "none", value: "none" }]);
    const [authoroptions, setAuthorOptions] = useState([{ name: "none", value: "none" }]);
    const [file, setFile] = useState(null);

    async function fetchData() {
        const blogData = new apiService();
        blogData.getBlog().then((data) => setBlogs(data));
    }
    async function fetchImages() {
        const galleryImages = new apiService();
        galleryImages.getImages().then((data) => setGallery(data));
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
        setFile(null);
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
        formData.append("author", data.author);
        formData.append("review", data.review);
        formData.append("image", file ? file : data.feature_image);
        formData.append("parentcategory", data.parentcategory);
        formData.append("subcategory", data.subcategory);
        formData.append("blogdate", data.blogdate);
        formData.append("status", data.status);
        formData.append("publishdate", data.publishdate);
        formData.append("content", data.content);

        if (blog.id) {
            await Axios.put(`http://localhost:5000/api/blog/${data.id}`, formData);
        } else {
            await Axios.post("http://localhost:5000/api/blog", formData);
        }
        setImages([]);
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
        _blog["blogdate"] =  new Date(blog.blogdate);
        setBlog(_blog);
        setProductDialog(true);
    };

    const confirmDeleteProduct = (blog) => {
        setBlog(blog);
        setDeleteProductDialog(true);
    };
    const updateStatus = async (rowData) => {
        await Axios.put(`http://localhost:5000/api/blog/status/${rowData.id}`, rowData);
    };
    const blogStatus = (rowData) => {
        const index = findIndexById(rowData.id);
        let _blogList = [...blogs];
        let _blog = { ...rowData };
        _blog["status"] = rowData.status === 0 ? 1 : 0;
        _blogList[index] = _blog;
        setBlogs(_blogList);
        updateStatus(_blog);
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


    const statusItemTemplate = (option) => {
        return <span className={`status-badge status-${option.name}`}>{option.name}</span>;
    }


    const onUpload = async (event) => {
        setFile(event.files[0]);
        toast.current.show({ severity: "success", summary: "Successfully", detail: `Image Added Successfully`, life: 3000 });
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
                {rowData.author}
            </>
        );
    };
    const review_idTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.review}
            </>
        );
    };
    const featureimageTemplate = (rowData) => {
        return (
            <>
                <Image src={`assets/demo/images/gallery/${rowData.feature_image}`} imageStyle={{width: '100px',height: '100px',objectFit: 'cover'}} preview={true} alt={rowData.feature_image} />
            </>
        );
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
    // const subcategory_idTemplate = (rowData) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Name</span>
    //             {rowData.parentcategory}
    //             {rowData.subcategory}
    //         </>
    //     );
    // };
    const statusTemplate = (rowData) => {
        return (
            <>
            {rowData.status}
                {/* <div className="actions">
                    <Button icon={rowData.status === 0 ? "pi pi-angle-double-down" : "pi pi pi-angle-double-up"} className={`${rowData.status === 0 ? "p-button p-button-secondary mr-2" : "p-button p-button-success mr-2"}`} onClick={() => blogStatus(rowData)} />
                </div> */}
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
                    <h5>Blog Page</h5>
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
                        <Column field="Image" header="Image" sortable body={featureimageTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="blog_title" header="Title" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="author_id" header="Author" sortable body={authoridTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="review_id" header="Review" sortable body={review_idTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="parentcategory_id" header="Parentcat" sortable body={parentcategory_idTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        {/* <Column field="subcategory_id" header="Subcat" sortable body={subcategory_idTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column> */}
                        <Column field="status" header="Status" sortable body={statusTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "1200px" }} header="Manage blog" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {/* {blog.feature_image && <Image src={`assets/demo/images/gallery/${blog.feature_image}`} preview={true} alt={blog.feature_image} />} */}
                        {/* {blog.feature_image && <img src={`assets/demo/images/gallery/${blog.feature_image}`} alt={blog.feature_image} width="100" className="shadow-2 round" />} */}
                        <form className="grid p-fluid">
                            <div className="col-12 md:col-8">
                                <div className="card p-fluid">
                                    <h5>Content</h5>
                                    <Editor style={{ height: "320px" }} value={blog.content} onTextChange={(e) => onInputChange(e, "content")} />
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
                                                <FileUpload auto url="http://localhost:5000/api/blog" className="mb-5" name="image" customUpload uploadHandler={onUpload} accept="image/*" maxFileSize={1000000} />
                                            </TabPanel>
                                        </TabView>
                                    </AccordionTab>
                                </Accordion>
                                {/* imagesection */}

                                {/* categorydropdwon */}
                                <Accordion>
                                    <AccordionTab header="Category Section">
                                        <MultiSelect options={parentCategory} className="mb-5" value={blog.parentcategory} onChange={(e) => onInputChange(e, "parentcategory")} optionLabel="name" placeholder="Select a parent category" display="chip" />
                                        <MultiSelect options={subCategory} value={blog.subcategory} onChange={(e) => onInputChange(e, "subcategory")} optionLabel="name" placeholder="Select a category" display="chip" />
                                    </AccordionTab>
                                </Accordion>
                                {/* categorydropdwon */}
                                {/* authordropdown */}
                                <Accordion>
                                    <AccordionTab header="Author Section">
                                        <Dropdown options={authoroptions} value={blog.author} onChange={(e) => onInputChange(e, "author")} className={classNames({ "p-invalid": submitted && !blog.author }, "mb-5")} placeholder="Author Name" optionLabel="name"></Dropdown>

                                        <Dropdown options={authoroptions} value={blog.review} onChange={(e) => onInputChange(e, "review")} className={classNames({ "p-invalid": submitted && !blog.review }, "mb-5")} placeholder="Reviewer Name" optionLabel="name"></Dropdown>

                                        
                                    </AccordionTab>
                                </Accordion>
                                <Accordion>
                                    <AccordionTab header="publish Section">
                                        <Dropdown options={statusOptions} itemTemplate={statusItemTemplate} value={blog.status} onChange={(e) => onInputChange(e, "status")} className={classNames({ "p-invalid": submitted && !blog.status }, "mb-5")} placeholder="Select status" optionLabel="name"></Dropdown>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <Calendar id="date" value={blog.blogdate} onChange={(e) => onInputChange(e, "blogdate")} />
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

                    <Dialog visible={galleryDialog} style={{ width: "1200px" }} header="Gallery" modal onHide={hideGalleryDialog}>
                        <div className="grid">
                            {gallery && gallery ? (
                                gallery?.map((item, index) => {
                                    return (
                                        <div className="col-12 md:col-2" key={index}>
                                            <Checkbox className="cursor-pointer" inputId={`cb3${index}`} value={`${item.image}`} onChange={onImageChange} checked={images.includes(`${item.image}`)}></Checkbox>
                                            <label htmlFor={`cb3${index}`} className="p-checkbox-label">
                                                <img src={`assets/demo/images/gallery/${item.image}`} alt={item.alt_title} style={{ width: "100%", height: "200px", objectFit: "cover", cursor: "pointer" }} className="mt-0 mx-auto mb-5 block shadow-2" />
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
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Blogs, comparisonFn);
