import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ImagesServices } from "../service/GalleryServices";
import Axios from "axios";

function Gallery() {

    let emptyImage = {
        id: "",
        image: "",
        title: "",
        alt_title: "",
    };

    // const [blogs, setBlogs] = useState("");
    const [images, setImages] = useState("");
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [image, setImage] = useState(emptyImage);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [file, setFile] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const fileRef = useRef(null);

    const fetchData = () => {
        const getImages = new ImagesServices();
        getImages.getImages().then((data) => setImages(data));
    }

    useEffect(() => {
        fetchData();
    }, []);


    const openNew = () => {
        setImage(emptyImage);
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
            let _images = [...images];
            let _image = { ...image };
            if (image.id) {
                const index = findIndexById(image.id);

                _images[index] = _image;
                updateImageFunction(_image);
                toast.current.show({ severity: "warn", summary: "Successfully", detail: "Image Updated", life: 3000 });
            } else {
                //   _blog.id = createId();
                addImageFunction(_image);
                _images.push(_image);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "Image Added", life: 3000 });
                fileRef.current.clear();
            }

            setImages(_images);
            setProductDialog(false);
            setImage(emptyImage);
    };

    const addImageFunction = async (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("alt_title", data.alt_title);
        formData.append("image", file);
        await Axios.post("http://localhost:5000/api/image", formData);
            fetchData();
    };

    const updateImageFunction = async (data) => {
        const fileImg = file ? file : data.image;
        console.log(fileImg);
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("alt_title", data.alt_title);
        formData.append("image", fileImg);
        await Axios.put(`http://localhost:5000/api/image/${data.id}`, formData)
        fetchData();
        setFile(null)
    };

    const editProduct = (image) => {
        setImage({ ...image });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (image) => {
        setImage(image);
        setDeleteProductDialog(true);
    };

    const deleteImageFunction = async (data) => {
        let selectedIds = typeof data === "number" ? data : data.map((res) => res.id);
        await Axios.delete(`http://localhost:5000/api/image/${selectedIds}`)
        fetchData();
        toast.current.show({ severity: "success", summary: "Successfully", detail: "Deleted Successfully", life: 3000 });
    };

    const deleteProduct = () => {
        deleteImageFunction(image.id);
        setDeleteProductDialog(false);
        setImage(emptyImage);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < images.length; i++) {
            if (images[i].id === id) {
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
        let _images = images.filter((val) => !selectedBlogs.includes(val));
        setImages(_images);
        deleteImageFunction(selectedBlogs);
        setDeleteProductsDialog(false);
        setSelectedBlogs(null);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _image = { ...image };
        _image[`${name}`] = val;
        setImage(_image);
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

    
    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                <img src={`assets/demo/images/gallery/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
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

    const parentNameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.alt_title}
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
            <h5 className="m-0">Manage Gallery</h5>
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
                    <h5>Gallery</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={images}
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
                        emptyMessage="No images found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="images" header="Images" sortable body={imageBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="title" header="Title" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="alt_title" header="Alt Title" sortable body={parentNameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "600px" }} header="CTA Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {image.title && <img src={`assets/demo/images/gallery/${image.image}`} alt={image.image} width="250" className="mt-0 mx-auto mb-5 block shadow-2" />}
                        <div className="grid">
                            <div className="col-12">
                                <div className="p-fluid">
                                    {/* <h5>Vertical</h5> */}
                                    <div className="field">
                                    <FileUpload auto ref={fileRef} className="mb-5" name="image" customUpload multiple uploadHandler={myUploader}  accept="image/*" maxFileSize={1000000} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="imageTitle">Title</label>
                                        <InputText id="imageTitle" type="text" value={image.title} onChange={(e) => onInputChange(e, "title")} />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="altTitle">Alt Title</label>
                                        <InputText id="altTitle" type="text" value={image.alt_title} onChange={(e) => onInputChange(e, "alt_title")} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {image && (
                                <span>
                                    Are you sure you want to delete <b>{image.title}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {image && <span>Are you sure you want to delete the selected CTA's?</span>}
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

export default React.memo(Gallery, comparisonFn);
