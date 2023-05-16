import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { apiService } from "../service/apiServices";
import Axios from "axios";
import { Accordion, AccordionTab } from "primereact/accordion";
import { MultiSelect } from "primereact/multiselect";
import { TabView, TabPanel } from "primereact/tabview";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";
import { Editor } from "@tinymce/tinymce-react";
import { format } from 'date-fns'

function Products() {
    let emptyproducts = {
        id: "",
        image: "",
        product_name: "",
        product_price: "",
        product_slug: "",
        strength: "",
        parentcategory: null,
        subcategory: "",
        othercompany: "",
        otherprice: "",
        aboutheader: "",
        abouteditor: "",
        newsheader: "",
        newseditor: "",
        advanceheader: "",
        advanceeditor: "",
        status: 0,
        date: new Date()
    };

    const [allProducts, setAllProducts] = useState("");
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setproduct] = useState(emptyproducts);
    const [selectedBlogs, setSelectedBlogs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [galleryDialog2, setGalleryDialog2] = useState(false);
    const [images2, setImages2] = useState([]);
    const [gallery2, setGallery2] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [parentCategory, setParentCategory] = useState([null]);
    const [subCategory, setSubCategory] = useState([{ name: "none", value: "none" }]);
    const toast = useRef(null);
    const dt = useRef(null);
    const [state, setState] = useState(null);


    const statusOptions = [{ name: 'Publish', value: 'publish' },
    { name: 'Draft', value: 'draft' },
    { name: 'Trash', value: 'trash' }]


    useEffect(() => {
        const getProducts = new apiService();
        getProducts.getProducts().then((data) => { setAllProducts(data) });
        setState(null);
        getParentCategory();
        getsubCategory();
        fetchImages()
    }, [state]);

    console.log(product)

    async function fetchImages() {
        const galleryImages = new apiService();
        galleryImages.getImages().then((data) => {
        setGallery2(data)});
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
    const openNew = () => {
        setproduct(emptyproducts);
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

    const statusItemTemplate = (option) => {
        return <span className={`status-badge status-${option.name}`}>{option.name}</span>;
    }

    const saveProduct = async () => {
        setSubmitted(true);
        if (product.product_name.trim()) {
            let _allProducts = [...allProducts];
            let _product = { ...product };
            if (product.id) {
                const index = findIndexById(product.id);

                _allProducts[index] = _product;
                addupdateproductFunction(_product);
                toast.current.show({ severity: "warn", summary: "Successfully", detail: "Product Updated", life: 3000 });
            } else {
                addupdateproductFunction(_product);
                toast.current.show({ severity: "success", summary: "Successfully", detail: "Product Created", life: 3000 });
            }

            setAllProducts(_allProducts);
            setProductDialog(false);
            setproduct(emptyproducts);
        }
    };

    const addupdateproductFunction = async (data) => {
        const formData = new FormData();
        formData.append("image[]", data.image);
        formData.append("product_name", data.product_name);
        formData.append("product_price", data.product_price);
        formData.append("product_slug", data.product_slug);
        formData.append("strength", data.strength);
        formData.append("parentcategory", data.parentcategory);
        formData.append("subcategory", data.subcategory);
        formData.append("othercompany", data.othercompany);
        formData.append("otherprice", data.otherprice);
        formData.append("aboutheader", data.aboutheader);
        formData.append("abouteditor", data.abouteditor);
        formData.append("newsheader", data.newsheader);
        formData.append("newseditor", data.newseditor);
        formData.append("advanceheader", data.advanceheader);
        formData.append("advanceeditor", data.advanceeditor);
        formData.append("status", data.status);
        formData.append("date", data.date);

        if (product.id) {
            await Axios.put(`http://192.168.0.143:5000/api/products/${data.id}`, formData);
        } else {
            await Axios.post("http://192.168.0.143:5000/api/products", formData);
        }
        setState(formData)
    };

    const editProduct = (product) => {
        let _product = { ...product };
        if (_product.parentcategory.includes(",")) {
            var parentCategoryArray = _product.parentcategory.split(",");
        } else {
            var parentCategoryArray = [];
            parentCategoryArray.push(_product.parentcategory);
        }
        if (_product.subcategory.includes(",")) {
            var subCategoryArray = _product.subcategory.split(",");
        } else {
            var subCategoryArray = [];
            subCategoryArray.push(_product.subcategory);
        }
        _product["parentcategory"] = parentCategoryArray;
        _product["subcategory"] = subCategoryArray;
        _product["date"] = new Date(product.date);
        setproduct(_product);
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setproduct(product);
        setDeleteProductDialog(true);
        deleteBlogFunction(product.id);
    };

    const deleteBlogFunction = (data) => {
        let selectedIds = typeof data === "number" ? data : data.map((res) => res.id);
        Axios.delete(`http://192.168.0.143:5000/api/products/${selectedIds}`)
            .then()
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteProduct = () => {
        let _allProducts = allProducts.filter((val) => val.id !== product.id);
        setAllProducts(_allProducts);
        setDeleteProductDialog(false);
        setproduct(emptyproducts);
        toast.current.show({ severity: "error", summary: "Successfully", detail: "product Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < allProducts.length; i++) {
            if (allProducts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const myUploader = async (event) => {
        try{
        const formData = new FormData();
        event.files.map((item) => {
            formData.append("image[]",item)
        })
        const res = await Axios.post('http://192.168.0.143:5000/api/image',formData)
        fetchImages();
        setProductDialog(false)
        toast.current.show({ severity: "success", summary: "Successfully", detail: `${res.data}`, life: 3000 })
        }catch(err){
        toast.current.show({ severity: "danger", summary: "Error", detail: `${err}`, life: 3000 });
        }
    }

    const openImageGallery2 = (e) => {
        e.preventDefault();
        setGalleryDialog2(true);
    };

    const hideGalleryDialog2 = () => {
        setGalleryDialog2(false);
    };

    const onImageChange2 = (e, name) => {
        let selectedImages = [...images2];
        if (e.checked) selectedImages.push(e.value);
        else selectedImages.splice(selectedImages.indexOf(e.value), 1);
        setImages2(selectedImages);
        onInputChange(e, name, selectedImages);
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _allProducts = allProducts.filter((val) => !selectedBlogs.includes(val));
        setAllProducts(_allProducts);
        deleteBlogFunction(selectedBlogs);
        setDeleteProductsDialog(false);
        setSelectedBlogs(null);
        toast.current.show({ severity: "success", summary: "Successfully", detail: "Blogs Deleted", life: 3000 });
    };

    const onInputChange = (e, name,selectedImages) => {
        let val;
        (name === "abouteditor" || name === "newseditor" || name === "advanceeditor") ? (val = e || "") : (val = (e.target && e.target.value) || "");
        let _product = { ...product };
        if (name === "product_slug") {
            val = e.target.value.replace(" ", "-");
        }
        if (name === "feature_image") {
            _product[`${name}`] =  selectedImages[0];
            _product[`image`] = selectedImages;
        }else{
        _product[`${name}`] = val;
        }
        setproduct(_product);
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


    const codeBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.id}
            </>
        );
    };

    const product_nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.product_name}
            </>
        );
    };


    const statusBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.status}
            </>
        );
    };
    const dateBodyTemplate = (rowData) => {
        let productDate = new Date(rowData.date);
        const result=format(productDate,'dd/MM/yyyy')
        return (
            <>
                {result}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeleteProduct(rowData)} />
                <Button icon="pi pi-eye" className="p-button-rounded p-button-success" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
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
                    <h5>Product Page</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={allProducts}
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
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="product_name" header="Name" sortable body={product_nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="status" header="status" sortable body={statusBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="date" header="date" sortable body={dateBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "100%",maxHeight:"100vh" }} header="" modal className="p-fluid blogmodal" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="grid py-5 p-fluid">
                            <div className="col-12 md:col-4">
                                {/* productsection  */}
                                <Accordion>
                                    <AccordionTab header="Product Section">
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label mb-5 mt-2">
                                                <InputText type="text" id="name" value={product.product_name} onChange={(e) => onInputChange(e, "product_name")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="product_name">product name</label>
                                            </span>
                                            <span className="p-float-label mb-5 mt-4">
                                                <InputText type="text" value={product.product_price} onChange={(e) => onInputChange(e, "product_price")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="product_price">product price</label>
                                            </span>
                                            <span className="p-float-label mb-5 mt-4">
                                                <InputText type="text" value={product.product_slug} onChange={(e) => onInputChange(e, "product_slug")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="product_slug">product slug</label>
                                            </span>
                                            <span className="p-float-label mb-5 mt-4">
                                                <InputText type="text" value={product.strength} onChange={(e) => onInputChange(e, "strength")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="strength">product strength</label>
                                            </span>
                                            <MultiSelect options={parentCategory} className="mb-5" value={product.parentcategory} onChange={(e) => onInputChange(e, "parentcategory")} optionLabel="name" placeholder="Select a parent category" display="chip" />
                                            <MultiSelect options={subCategory} value={product.subcategory} onChange={(e) => onInputChange(e, "subcategory")} optionLabel="name" placeholder="Select a category" display="chip" />
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                                {/* productsection */}
                            </div>
                            {/* imagesection */}
                            <div className="col-12 md:col-4">
                                <Accordion>
                                <AccordionTab header="Image Section">
                                        <TabView>
                                            <TabPanel header="upload">
                                            <FileUpload url="http://192.168.0.143:5000/api/image" className="mb-5" name="image[]" multiple customUpload uploadHandler={myUploader} accept="image/*" maxFileSize={1000000} />
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
                            </div>
                            {/* imagesection */}
                            {/* status */}
                            <div className="col-12 md:col-4">
                                <Accordion>
                                    <AccordionTab header="publish Section">
                                        <Dropdown options={statusOptions} itemTemplate={statusItemTemplate} value={product.status} onChange={(e) => onInputChange(e, "status")} className={classNames({ "p-invalid": submitted && !product.status }, "mb-5")} placeholder="Select status" optionLabel="name"></Dropdown>
                                        <div className=" p-field mb-5">
                                            <span className="p-float-label mb-5 mt-2">
                                                <Calendar id="date" value={product.date} onChange={(e) => onInputChange(e, "date")} />
                                                <label htmlFor="date">Product date</label>
                                            </span>
                                            <span className="p-float-label mb-5 mt-2">
                                                <InputText type="text" value={product.othercompany} onChange={(e) => onInputChange(e, "othercompany")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="othercompany">Company name</label>
                                            </span>
                                            <span className="p-float-label mb-5 mt-2">
                                                <InputText type="text" value={product.otherprice} onChange={(e) => onInputChange(e, "otherprice")} style={{ fontSize: "12px" }} />
                                                <label htmlFor="otherprice">Company price</label>
                                            </span>
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                            {/* status */}
                            <div className="col-12 md:col-4">
                                <Accordion>
                                    <AccordionTab header="About Section">
                                        <span className="p-float-label mb-5 mt-2">
                                            <InputText type="text" value={product.aboutheader} onChange={(e) => onInputChange(e, "aboutheader")} style={{ fontSize: "12px" }} />
                                            <label htmlFor="aboutheader">About</label>
                                        </span>
                                        <Editor
                                            className="editor"
                                            style={{ width: "100%" }}
                                            tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                            value={product.abouteditor}
                                            init={{
                                                height: 500,
                                                plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                                toolbar:
                                                    "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                            }}
                                            onEditorChange={(e) => {
                                                onInputChange(e, "abouteditor")
                                            }}
                                        />
                                    </AccordionTab>
                                </Accordion>
                            </div>
                            <div className="col-12 md:col-4">
                                <Accordion>
                                    <AccordionTab header="News Section">
                                        <span className="p-float-label mb-5 mt-2">
                                            <InputText type="text" value={product.newsheader} onChange={(e) => onInputChange(e, "newsheader")} style={{ fontSize: "12px" }} />
                                            <label htmlFor="newsheader">News</label>
                                        </span>
                                        <Editor
                                            init={{
                                                height: 300,
                                                plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                                toolbar:
                                                    "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                            }}
                                            tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                            value={product.newseditor}
                                            onEditorChange={(e) => {
                                                onInputChange(e, "newseditor")
                                            }}
                                        />
                                    </AccordionTab>
                                </Accordion>
                            </div>
                            <div className="col-12 md:col-4">
                                <Accordion>
                                    <AccordionTab header="Advance Section">
                                        <span className="p-float-label mb-5 mt-2">
                                            <InputText type="text" id="advanceheader" value={product.advanceheader} onChange={(e) => onInputChange(e, "advanceheader")} style={{ fontSize: "12px" }} />
                                            <label htmlFor="advanceheader">Advance</label>
                                        </span>
                                        <Editor
                                            init={{
                                                height: 300,
                                                plugins: ["advlist media autolink lists link image charmap print preview anchor", "searchreplace visualblocks code fullscreen table", "importcss insertdatetime media table paste code help wordcount template"],
                                                toolbar:
                                                    "undo redo | fontselect | formatselect | image media | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat | template | help",
                                            }}
                                            tinymceScriptSrc="https://cdn.tiny.cloud/1/crhihg018llbh8k3e3x0c5e5l8ewun4d1xr6c6buyzkpqwvb/tinymce/5/tinymce.min.js"
                                            value={product.advanceeditor}
                                            onEditorChange={(e) => {
                                                onInputChange(e, "advanceeditor")
                                            }}
                                        />
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>
                    </Dialog>

                    {/* gallery for product  */}
                    <Dialog visible={galleryDialog2} style={{ width: "100%" }} header="Gallery" modal onHide={hideGalleryDialog2}>
                        <div className="grid">
                            {gallery2 && gallery2 ? (
                                gallery2?.map((item, index) => {
                                    return (
                                        <div className="col-12 md:col-2" key={index}>
                                            <Checkbox className="cursor-pointer" inputId={`cb3${index}`} value={`${item.image}`} onChange={(e) => onImageChange2(e, "feature_image")} checked={images2.includes(`${item.image}`)}></Checkbox>
                                            <label htmlFor={`cb3${index}`} className="p-checkbox-label">
                                                <img
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
                    {/* gallery for product  */}
                    

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.product_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {product && <span>Are you sure you want to delete the selected product's?</span>}
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

export default React.memo(Products, comparisonFn);
