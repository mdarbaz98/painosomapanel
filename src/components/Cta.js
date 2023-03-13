import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { CtaServices } from "../service/CtaServices";
import { Editor } from "primereact/editor";
import Axios from "axios";

function Blogs() {
    const categories = [
        { name: "Anxiety", value: "anxiety" },
        { name: "Healthy Lifestyle", value: "healthylifestyle" },
        { name: "none", value: "0" },
    ];

    let emptyCta = {
        id: "",
        title: "",
        link: "",
        description: "",
        images: "",
    };

    // const [blogs, setBlogs] = useState("");
    const [allCta, setAllCta] = useState("");
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    // const [blog, setBlog] = useState(emptyBlog);
    const [cta, setCta] = useState(emptyCta);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [content, setContent] = useState("<p>Hello World!</p>");
    const [file, setFile] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const fileRef = useRef(null);

    const [state, setState] = useState(null);

    useEffect(() => {
        const getCta = new CtaServices();
        getCta.getCta().then((data) => setAllCta(data));
        setState(null);
    }, [state]);
    const openNew = () => {
        setCta(emptyCta);
        setSubmitted(false);
        setProductDialog(true);
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
        if (cta.title.trim()) {
            let _allCta = [...allCta];
            let _cta = { ...cta };
            if (cta.id) {
                const index = findIndexById(cta.id);

                _allCta[index] = _cta;
                updateBlogFunction(_cta);
                toast.current.show({ severity: "warn", summary: "Successfully", detail: "blog Updated", life: 3000 });
            } else {
                //   _blog.id = createId();
                addBlogFunction(_cta);
                _allCta.push(_cta);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "blog Created", life: 3000 });
                fileRef.current.clear();
            }

            setAllCta(_allCta);
            setProductDialog(false);
            setCta(emptyCta);
        }
    };

    const addBlogFunction = async (data) => {
        const formData = new FormData();
        formData.append("blogTitle", data.blog_title);
        formData.append("seo_title", data.seo_title);
        formData.append("blog_slug", data.blog_slug);
        formData.append("keywords", data.keywords);
        formData.append("meta_desc", data.meta_desc);
        formData.append("author_name", data.author_name);
        formData.append("image", file);
        formData.append("alt_title", data.alt_title);
        formData.append("img_title", data.img_title);
        formData.append("category", data.category);
        formData.append("excerpt", data.excerpt);
        await Axios.post("http://localhost:5000/api/cta", formData)
            .then()
            .catch((err) => console.log(err));
        // setState(formData)
    };

    const updateBlogFunction = async (data) => {
        const fileImg = file ? file : data.feature_img;

        const formData = new FormData();
        formData.append("blogTitle", data.blog_title);
        formData.append("seo_title", data.seo_title);
        formData.append("blog_slug", data.blog_slug);
        formData.append("keywords", data.keywords);
        formData.append("meta_desc", data.meta_desc);
        formData.append("author_name", data.author_name);
        formData.append("image", fileImg);
        formData.append("alt_title", data.alt_title);
        formData.append("img_title", data.img_title);
        formData.append("category", data.category);
        formData.append("excerpt", data.excerpt);
        await Axios.put(`http://localhost:5000/api/cta/${data.id}`, formData)
            .then()
            .catch((err) => console.log(err));

        setState(formData);
    };

    const editProduct = (cta) => {
        setCta({ ...cta });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (cta) => {
        setCta(cta);
        setDeleteProductDialog(true);
        deleteBlogFunction(cta.id);
    };

    const deleteBlogFunction = (data) => {
        let selectedIds = typeof data === "number" ? data : data.map((res) => res.id);
        Axios.delete(`http://localhost:5000/api/cta/${selectedIds}`)
            .then()
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteProduct = () => {
        let _allCta = allCta.filter((val) => val.id !== cta.id);
        setAllCta(_allCta);
        setDeleteProductDialog(false);
        setCta(emptyCta);
        toast.current.show({ severity: "error", summary: "Successfully", detail: "CTA Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < allCta.length; i++) {
            if (allCta[i].id === id) {
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
        let _allCta = allCta.filter((val) => !selectedBlogs.includes(val));
        setAllCta(_allCta);
        deleteBlogFunction(selectedBlogs);
        setDeleteProductsDialog(false);
        setSelectedBlogs(null);
        toast.current.show({ severity: "success", summary: "Successfully", detail: "Blogs Deleted", life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _cta = { ...cta };
        _cta[`${name}`] = val;
        setCta(_cta);
    };

    const myUploader = (event) => {
        toast.current.show({ severity: "info", summary: "Successfully", detail: "File Added", life: 3000 });
        setFile(event.files[0]);
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
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData) => {
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
                {rowData.title}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                <img src={`assets/demo/images/blogs/${rowData.feature_img}`} alt={rowData.feature_img} className="shadow-2" width="100" />
            </>
        );
    };

    const parentNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.link}
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
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>CTA Page</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={allCta}
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
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="title" header="Title" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="images" header="Images" sortable body={imageBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="link" header="Link" sortable body={parentNameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "450px" }} header="CTA Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {/* {blog.feature_img && <img src={`assets/demo/images/blogs/${blog.feature_img}`} alt={blog.feature_img} width="250" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="grid">
                            <div className="col-12">
                                <div className="p-fluid">
                                    {/* <h5>Vertical</h5> */}
                                    <div className="field">
                                        <label htmlFor="ctaTitle">Title</label>
                                        <InputText id="ctaTitle" type="text" value={cta.title} onChange={(e) => onInputChange(e, "title")} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="ctaLink">CTA link</label>
                                        <InputText id="ctaLink" type="text" value={cta.link} onChange={(e) => onInputChange(e, "link")} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="description">Description</label>
                                        <InputTextarea id="description" value={cta.description} onChange={(e) => onInputChange(e, "description")} required rows={3} cols={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {cta && (
                                <span>
                                    Are you sure you want to delete <b>{cta.title}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {cta && <span>Are you sure you want to delete the selected CTA's?</span>}
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

export default React.memo(Blogs, comparisonFn);
