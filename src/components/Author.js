import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { TabView, TabPanel } from "primereact/tabview";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import Axios from "axios";
import { apiService } from "../service/apiServices";
import { Accordion, AccordionTab } from "primereact/accordion";

function Author() {
    let emptyAuthor = {
        id: "",
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
        about_soma: "",
        status: 0,
    };
    const option = [
        { name: "Author", value: "Author" },
        { name: "Reviewer", value: "Reviewer" },
    ];

    const [blogs, setBlogs] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [blog, setBlog] = useState(emptyAuthor);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted,setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [file, setFile] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [titleCount, ChangeTitleCount] = useState(0);
    const [textAreaCount, ChangeTextAreaCount] = useState(0);

    async function fetchData() {
        const blogData = new apiService();
        blogData.getAuthor().then((data) => {
            setBlogs(data);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {}, [blog.parentcategory_id]);

    const openNew = () => {
        setBlog(emptyAuthor);
        setSubmitted(false);
        setProductDialog(true);
        setFile(null);
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

        const image = file ? file : blog.image;

        if (blog.name.trim() && image) {
            let _blogs = [...blogs];
            let _blog = { ...blog };
            if (blog.id) {
                const index = findIndexById(blog.id);

                _blogs[index] = _blog;
                addUpdate(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "Author Updated", life: 3000 });
            } else {
                addUpdate(_blog);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "Author Created", life: 3000 });
            }

            setBlogs(_blogs);
            setProductDialog(false);
            setBlog(emptyAuthor);
        }
    };

    const addUpdate = async (data) => {
        const formData = new FormData();
        formData.append("image[]", file ? file : data.image);
        formData.append("name", data.name);
        formData.append("position", data.position);
        formData.append("slug", data.slug);
        formData.append("degree", data.degree);
        formData.append("seo_title", data.seo_title);
        formData.append("seo_description", data.seo_description);
        formData.append("linkedin", data.linkedin);
        formData.append("highlight", data.highlight);
        formData.append("experience", data.experience);
        formData.append("education", data.education);
        formData.append("about_soma", data.about_soma);
        formData.append("status", data.status);
        console.log(blog.id);
        if (blog.id) {
            await Axios.put(`http://localhost:5000/api/author/${data.id}`, formData);
        } else {
            await Axios.post("http://localhost:5000/api/author", formData);
        }
        setFile(null);
        fetchData();
    };

    const editProduct = (blog) => {
        setBlog({ ...blog });
        setProductDialog(true);
    };

    const updateStatus = async (rowData) => {
        await Axios.put(`http://localhost:5000/api/author/status/${rowData.id}`, rowData);
        fetchData();
    };

    const authorStatus = (rowData) => {
        const index = findIndexById(rowData.id);
        let _auhtorList = [...blogs];
        let _author = { ...rowData };
        _author["status"] = rowData.status === 0 ? 1 : 0;
        _auhtorList[index] = _author;
        setBlogs(_auhtorList);
        updateStatus(_author);
    };

    const confirmDeleteProduct = (blog) => {
        setBlog(blog);
        setDeleteProductDialog(true);
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
        console.log(e, name);
        let val;
        name === "highlight" || name === "experience" || name === "about_soma" || name === "education" ? (val = e || "") : (val = (e.target && e.target.value) || "");
        let _blog = { ...blog };
        if (name === "slug") {
            val = e.target.value.replace(" ", "-");
        }
        _blog[`${name}`] = val;
        setBlog(_blog);
    };

    const imageUpload = async (event) => {
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


    const nameBodyTemplate = (rowData) => {
        return <>{rowData.name}</>;
    };
    const imageTemplate = (rowData) => {
        return (
            <>
                <img src={`assets/demo/images/gallery/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };
    const positionTemplate = (rowData) => {
        return <>{rowData.position}</>;
    };
    const statusTemplate = (rowData) => {
        return (
            <>
                <div className="actions">
                    <Button icon={rowData.status === 0 ? "pi pi-angle-double-down" : "pi pi pi-angle-double-up"} className={`${rowData.status === 0 ? "p-button p-button-secondary mr-2" : "p-button p-button-success mr-2"}`} onClick={() => authorStatus(rowData)} />
                </div>
            </>
        );
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mr-2" onClick={() => confirmDeleteProduct(rowData)} />
                <Button icon="pi pi-eye" className="p-button-rounded p-button-success" onClick={() => confirmDeleteProduct(rowData)} />
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


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <h5>Author Page</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

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
                        <Column field="image" header="Image" sortable body={imageTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="position" header="Position" sortable body={positionTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="status" header="Status" sortable body={statusTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "100%" }} header="" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div>{blog && <img src={`assets/demo/images/gallery/${blog.image}`} alt={blog.image} className="shadow-2" width="100" />}</div>
                        <form className="grid py-5 p-fluid">
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
                                                <InputText
                                                    type="text"
                                                    id="seo_title"
                                                    value={blog.seo_title}
                                                    onChange={(e) => {
                                                        let countvalue = e.target.value.length;
                                                        ChangeTitleCount(countvalue);
                                                        onInputChange(e, "seo_title");
                                                    }}
                                                    style={{ fontSize: "12px" }}
                                                />
                                                <label htmlFor="seo_title">SEO title</label>
                                            </span>
                                            <p>{titleCount}/60</p>
                                        </div>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="slug" value={blog.slug} onChange={(e) => onInputChange(e, "slug")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="slug">Author slug</label>
                                            </span>
                                        </div>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText
                                                    type="text"
                                                    id="seo_description"
                                                    value={blog.seo_description}
                                                    onChange={(e) => {
                                                        let countvalue = e.target.value.length;
                                                        ChangeTextAreaCount(countvalue);
                                                        onInputChange(e, "seo_description");
                                                    }}
                                                    style={{ fontSize: "12px" }}
                                                />
                                                <label htmlFor="seo_description">Author Description</label>
                                            </span>
                                            <p>{textAreaCount}/160</p>
                                        </div>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label">
                                                <InputText type="text" id="degree" value={blog.degree} onChange={(e) => onInputChange(e, "degree")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="degree">Author Degree</label>
                                            </span>
                                        </div>
                                        <Dropdown value={blog.position} onChange={(e) => onInputChange(e, "position")} placeholder="Select a position" options={option} optionLabel="name" />
                                    </AccordionTab>
                                </Accordion>
                                {/* seosection */}
                            </div>
                            <div className="col-12 md:col-4">
                                {/* imagesection */}
                                <Accordion>
                                    <AccordionTab header="Image Section">
                                        <TabView>
                                            <TabPanel header="upload">
                                                <FileUpload auto url="http://localhost:5000/api/image" className="mb-5" name="image[]" customUpload uploadHandler={imageUpload} accept="image/*" maxFileSize={1000000} />
                                            </TabPanel>
                                        </TabView>
                                    </AccordionTab>
                                </Accordion>
                                {/* imagesection */}
                            </div>
                            <div className="col-12 md:col-4">
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
                            <div className="col-12 md:col-6">
                                <div className="card p-fluid">
                                    <h5>Highlight</h5>
                                    <Editor
                                        init={{
                                            height: 300,
                                            plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                            toolbar:
                                                "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                        }}
                                        tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                        value={blog.highlight}
                                        onEditorChange={(e) => {
                                            onInputChange(e, "highlight");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="card p-fluid">
                                    <h5>Experience</h5>
                                    <Editor
                                        init={{
                                            height: 300,
                                            plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                            toolbar:
                                                "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                        }}
                                        tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                        value={blog.experience}
                                        onEditorChange={(e) => {
                                            onInputChange(e, "experience");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="card p-fluid">
                                    <h5>Education</h5>
                                    <Editor
                                        init={{
                                            height: 300,
                                            plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                            toolbar:
                                                "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                        }}
                                        tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                        value={blog.education}
                                        onEditorChange={(e) => {
                                            onInputChange(e, "education");
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="card p-fluid">
                                    <h5>About soma</h5>
                                    <Editor
                                        init={{
                                            height: 300,
                                            plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                            toolbar:
                                                "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                        }}
                                        tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                        value={blog.about_soma}
                                        onEditorChange={(e) => {
                                            onInputChange(e, "about_soma");
                                        }}
                                    />
                                </div>
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
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Author, comparisonFn);
