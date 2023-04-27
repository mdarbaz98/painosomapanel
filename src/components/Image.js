import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { apiService } from "../service/apiServices";
import Axios from "axios";

function Gallery() {

    let emptyImage = {
        id: "",
        image: "",
        title: "",
        alt_title: "",
    };
//multiple
    const [images, setImages] = useState("");
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
//single
    const [image, setImage] = useState(emptyImage);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const toast = useRef(null);
    const dt = useRef(null);

    const fetchData = () => {
        const getImages = new apiService();
        getImages.getImages().then((data) => {console.log(data);setImages(data)});
    }

    useEffect(() => {
        fetchData();
    }, []);


    const openNew = () => {
        setImage(emptyImage);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };


    const confirmDeleteProduct = (image) => {
        setImage(image);
        setDeleteProductDialog(true);
    };

    const deleteImageFunction = async (data) => {
        let selectedIds = typeof data.id === "number" ? data.id : data.map((res) => res.id);
        let imageName = data.image
        await Axios.delete(`http://192.168.0.143:5000/api/image/${selectedIds}`,imageName)
        fetchData();
        toast.current.show({ severity: "success", summary: "Successfully", detail: "Deleted Successfully", life: 3000 });
    };

    const deleteProduct = () => {
        deleteImageFunction(image);
        setDeleteProductDialog(false);
        setImage(emptyImage);
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


    const imageUpload = async (event) => {
        try{
        const formData = new FormData();
        formData.append("image",event.files[0])
        formData.append("title",event.files[0].name)
        const res = await Axios.post('http://192.168.0.143:5000/api/image',formData);
        fetchData();
        setProductDialog(false)
        toast.current.show({ severity: "success", summary: "Successfully", detail: `${res.data}`, life: 3000 })
        }catch(err){
        toast.current.show({ severity: "danger", summary: "Error", detail: `${err}`, life: 3000 });
        }
    }


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
                <img src={`assets/demo/images/gallery/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.title}
            </>
        );
    };

    const parentNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.alt_title}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteProduct(rowData)} />
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
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

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

                    <Dialog visible={productDialog} style={{ width: "600px" }} header="Image Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="grid">
                            <div className="col-12">
                                <div className="p-fluid">
                                    {/* <h5>Vertical</h5> */}
                                    <div className="field">
                                    <FileUpload url="http://192.168.0.143:5000/api/image" className="mb-5" name="image" customUpload uploadHandler={imageUpload}  accept="image/*" maxFileSize={1000000} />
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
                            {image && <span>Are you sure you want to delete the selected Images?</span>}
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
