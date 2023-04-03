import React, { useState, useEffect, useRef } from "react";
import { Editor } from 'primereact/editor';
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Axios from "axios";
import { apiService } from "../service/apiServices";
import { Accordion, AccordionTab } from 'primereact/accordion';

function Author() {
    let emptyAuthor = {
        id:"" ,
        name: "",
        image: "",
        position: "",
        slug: "",
        degree: "",
        seo_title: "",
        seo_description: "",
        linkedin: "",
        highlight: "",
        experience: "",
        education: "",
        about_soma: ""
    };

    const option = [
        { name: 'Author', value: 'Author' },
        { name: 'Reviewer', value: 'Reviewer' }
    ];

    const [blogs, setBlogs] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [blog, setBlog] = useState(emptyAuthor);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [gallery, setGallery] = useState(null);
    const [images, setImages] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const fileRef = useRef(null);


    async function fetchData() {
        const blogData = new apiService();
        blogData.getAuthor().then((data) => {
            console.log(data)
            setBlogs(data)});
    }
    async function fetchImages() {
        const galleryImages = new apiService();
        galleryImages.getImages().then((data) => setGallery(data));
    }

    useEffect(() => {
        fetchData();
        fetchImages();
    }, []);

    useEffect(() => {
    }, [blog.parentcategory_id]);
    
    const onImageChange = (e) => {
        let selectedImages = [...images];
        if (e.checked) selectedImages.push(e.value);
        else selectedImages.splice(selectedImages.indexOf(e.value), 1);

        setImages(selectedImages);
    };

    const openNew = () => {
        setBlog(emptyAuthor);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openImageGallery = () => {
        setDisplayBasic(true);
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

    const saveProduct = async () => {
        setSubmitted(true);
        if (blog.name.trim()) {
            let _blogs = [...blogs];
            let _blog = { ...blog };
            if (blog.id) {
                const index = findIndexById(blog.id);

                _blogs[index] = _blog;
                updateAuthorFunction(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Updated", life: 3000 });
            } else {
                //   _blog.id = createId();
                addAuthorFunction(_blog);
                // _blogs.push(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Created", life: 3000 });
            }

            setBlogs(_blogs);
            setProductDialog(false);
            setBlog(emptyAuthor);
        }
    };

    const addAuthorFunction = async (data) => {
        var createPost = {
            id:data.id ,
            name: data.name,
            image: data.image,
            position: data.position,
            slug: data.slug,
            degree: data.degree,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            linkedin: data.linkedin,
            highlight: data.highlight,
            experience: data.experience,
            education: data.education,
            about_soma: data.about_soma
        };

        await Axios.post("http://localhost:5000/api/author", createPost);
        setImages([]);
        fetchData();
    };

    const updateAuthorFunction = async (data) => {

        var updatePost = {
            id:data.id ,
            name: data.name,
            image: data.image,
            position: data.position,
            slug: data.slug,
            degree: data.degree,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            linkedin: data.linkedin,
            highlight: data.highlight,
            experience: data.experience,
            education: data.education,
            about_soma: data.about_soma
        };

        await Axios.put(`http://localhost:5000/api/author/${data.id}`, updatePost);
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
        await Axios.delete(`http://localhost:5000/api/author/${selectedIds}`).then();
        fetchData();
    };

    const deleteProduct = () => {
        deleteBlogFunction(blog.id);
        setDeleteProductDialog(false);
        setBlog(emptyAuthor);
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
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.name}
            </>
        );
    };
    const imageTemplate = (rowData) => {
        return (
            <>
                {rowData.image}
            </>
        );
    };
    const positionTemplate = (rowData) => {
        return (
            <>
                {rowData.position}
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
            <h5 className="m-0">Manage Authors</h5>
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

    const basicDialogFooter = <Button type="button" label="Dismiss" onClick={() => setDisplayBasic(false)} icon="pi pi-check" className="p-button-secondary" />;

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
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="image" header="Image" sortable body={imageTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="position" header="Position" sortable body={positionTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="status" header="Status" sortable body={statusTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "1200px" }} header="Manage authors" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <form className="grid p-fluid">
                            <div className="col-12 md:col-8">
                                <div className="card p-fluid">
                                    <h5>Content</h5>
                                    <Editor style={{ height: '320px' }} value={blog.content} onTextChange={(e) => onInputChange(e, "content")} />
                                </div>
                            </div>

                            <div className="col-12 md:col-4">
                                {/* seosection  */}
                                <Accordion>
                                    <AccordionTab header="Seo Section">
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="name" value={blog.name} onChange={(e) => onInputChange(e, "name")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="blog_title">Author name</label>
                                            </span>
                                        </div>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="seo_title" value={blog.seo_title} onChange={(e) => onInputChange(e, "seo_title")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="seo_title">SEO title</label>
                                            </span>
                                        </div>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="slug" value={blog.slug} onChange={(e) => onInputChange(e, "slug")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="slug">Author slug</label>
                                            </span>
                                        </div>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="seo_description" value={blog.seo_description} onChange={(e) => onInputChange(e, "seo_description")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="seo_description">Author Description</label>
                                            </span>
                                        </div>
                                        <Dropdown 
                                        value={blog.position} 
                                        onChange={(e) => onInputChange(e,"position")} 
                                        placeholder="Select a position" 
                                        options={option}
                                        optionLabel="name"
                                        />
                                    </AccordionTab>
                                </Accordion>
                                {/* seosection */}
                               {/* imagesection */}
                               <Accordion>
                                    <AccordionTab header="Image Section">
                                        <TabView>
                                            <TabPanel header="upload">
                                                <FileUpload auto ref={fileRef} url="http://localhost:5000/api/image" className="mb-5" name="image" onUpload={onUpload} accept="image/*" maxFileSize={1000000} />
                                            </TabPanel>
                                            <TabPanel header="Gallery">
                                                <Button label="select image" icon="pi pi-check" iconPos="right" onClick={openImageGallery} />
                                                {images?.map((item, ind) => {
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
                                
                                {/* authordropdown */}
                                <Accordion>
                                    <AccordionTab header="Social icons">
                                    <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="Linkedin" value={blog.linkedin} onChange={(e) => onInputChange(e, "linkedin")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="Linkedin">Linkedin</label>
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
                                    Are you sure you want to delete <b>{blog.name}</b>?
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

                    {/* image  gallery dialog  */}
                    <Dialog header="Gallery" visible={displayBasic} style={{ width: "1200px" }} modal footer={basicDialogFooter} onHide={() => setDisplayBasic(false)}>
                        <div className="grid">
                            {gallery ? gallery?.map((item, index) => {
                                return (
                                    <div className="col" key={index}>
                                        <Checkbox className="cursor-pointer" inputId={`cb3${index}`} value={`${item.image}`} onChange={onImageChange} checked={images.includes(`${item.image}`)}></Checkbox>
                                        <label htmlFor={`cb3${index}`} className="p-checkbox-label">
                                            <img src={`assets/demo/images/gallery/${item.image}`} alt={item.alt_title} width="250" className="mt-0 mx-auto mb-5 block shadow-2" />
                                        </label>
                                    </div>
                                );
                            }) : <p>No images </p>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Author, comparisonFn);
