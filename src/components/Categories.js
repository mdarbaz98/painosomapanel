
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
import { apiService } from "../service/apiServices";
import { Dropdown } from "primereact/dropdown";
import Axios from "axios";

function Categories() {


    // let initialValue =
    //     [{ name: "none", value: "0" }];

    const [parentcategory, setparentcategory] = useState(null);
    const [parentcategoryName, setparentcategoryName] = useState(null);

    let emptyCategory = {
        id: "",
        cat_name: "",
        cat_slug: "",
        cat_title: "",
        cat_desc: "",
        parent_category: 0,
        status: 0,
    };



    const [categoryList, setCategoryList] = useState("");
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        getAllCategories();
        getParentCategory();
    }, [categoryList.length]);

    // all the categories
    const getAllCategories = () => {
        // fetching all categories list
        const blogCategory = new apiService();
        blogCategory.getCategory().then((data) => setCategoryList(data));
    }


    async function getParentCategory() {
        const blogCategory = new apiService();
        const res = await blogCategory.getParentCategory()
        const output = res.map((data) => ({ name: data.cat_name, value: `${data.id}` }))
        setparentcategory([{ name: "none", value: "0" }, ...output]);
    }
    const openNew = () => {
        setCategory(emptyCategory);
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

        const res = await Axios.get(`http://localhost:5000/api/category/${category.parent_category}`);
        
        const getName = res.data[0].cat_name

        setparentcategoryName(getName)

        if (category.cat_name.trim()) {
            let _categories = [...categoryList];
            let _category = { ...category };
            if (category.id) {
                const index = findIndexById(category.id);
                _categories[index] = _category;
                updateCategoryFunction(_category,getName);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Category Updated", life: 3000 });
            } else {
                // _category.id = createId();
                addCategoryFunction(_category,getName);
                _categories.push(_category);
                toast.current.show({ severity: "success", summary: "Successful", detail: "Category Created", life: 3000 });
            }

            setCategoryList(_categories);
            setProductDialog(false);
        }
    };

    const addCategoryFunction = (data,name) => {
        console.log(name)
        Axios.post("http://localhost:5000/api/category", { cat_name: data.cat_name, parent_category: data.parent_category, cat_desc: data.cat_desc, cat_slug: data.cat_slug, cat_title: data.cat_title, status: data.status, parentcategory_name: name})
            .then()
            .catch((err) => console.log(err));
    };

    const updateCategoryFunction = (data) => {
        Axios.put(`http://localhost:5000/api/category/${data.id}`, { cat_name: data.cat_name, parent_category: data.parent_category, cat_desc: data.cat_desc, cat_slug: data.cat_slug, cat_title: data.cat_title, status: data.status })
            .then()
            .catch((err) => {
                console.log(err);
            });
    };

    const editProduct = (category) => {
        setCategory({ ...category });
        setProductDialog(true);
    };

    // SAMPLE
    const categoryStatus = (rowData) => {
        const index = findIndexById(rowData.id);
        let _categories = [...categoryList];
        let _category = {...rowData};  
        _category["status"] = rowData.status === 0 ? 1 : 0;
        _categories[index
        
        
        
        
        
        ] = _category
        setCategoryList(_categories);
        updateCategoryFunction(_category);
    }
    const confirmDeleteProduct = (category) => {
        setCategory(category);
        setDeleteProductDialog(true);
    };

    const deleteCategoryFunction = (data) => {
        let selectedIds = typeof (data) === "number" ? data : data.map(res => res.id);
        Axios.delete(`http://localhost:5000/api/category/${selectedIds}`)
            .then()
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteProduct = () => {
        deleteCategoryFunction(category.id);
        let _categories = categoryList.filter((val) => val.id !== category.id);
        setCategoryList(_categories);
        setDeleteProductDialog(false);
        setCategory(emptyCategory);
        toast.current.show({ severity: "error", summary: "Successful", detail: "Category Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < categoryList.length; i++) {
            if (categoryList[i].id === id) {
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
        deleteCategoryFunction(selectedProducts);
        let _categories = categoryList.filter((val) => !selectedProducts.includes(val));
        setCategoryList(_categories);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: "error", summary: "Successful", detail: "Category Deleted", life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _category = { ...category };
        _category[`${name}`] = val;
        setCategory(_category);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
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
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cat_name}
            </>
        );
    };
    const slugBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cat_slug}
            </>
        );
    };
    const titleBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cat_title}
            </>
        );
    };
    const categoryDescBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.cat_desc}
            </>
        );
    };
    const parent_categoryBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.parent_category}
            </>
        );
    };
    const parent_categoryNameBodyTemplate = (rowData) => {
        return (
            <>
                {rowData.parentcategory_name}
            </>
        );
    };
    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <div className="actions">
                    <Button icon={rowData.status === 0 ? "pi pi-angle-double-down" : "pi pi pi-angle-double-up"} className={`${rowData.status === 0 ? "p-button p-button-secondary mr-2" : "p-button p-button-success mr-2"}`} onClick={() => categoryStatus(rowData)} />
                </div>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-Primary mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Categories</h5>
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
                    <h5>Category Page</h5>
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={categoryList}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
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
                        <Column field="id" header="Id" sortable body={idBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="cat_name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cat_slug" header="Slug" sortable body={slugBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cat_title" header="Title" sortable body={titleBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cat_desc" header="Description" sortable body={categoryDescBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="parent_category" header="Parent Category" sortable body={parent_categoryBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="parent_category" header="Parent Category Name" sortable body={parent_categoryNameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="status" header="Status" sortable body={statusBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: "650px" }} header="Update Category" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`assets/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}
                        <div className="grid">
                            <div className="col-6">
                                <div className="field">
                                    <label htmlFor="categoryName">Category Name</label>
                                    <InputText id="name" value={category.cat_name} onChange={(e) => onInputChange(e, "cat_name")} required autoFocus className={classNames({ "p-invalid": submitted && !category.cat_name })} />
                                    {submitted && !category.cat_name && <small className="p-invalid">Category Name is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="parentCategory">Parent Category</label>
                                    <Dropdown id="parentCategory" options={parentcategory} value={category.parent_category} onChange={(e) => onInputChange(e, "parent_category")} className={classNames({ "p-invalid": submitted && !category.parent_category })} optionLabel="name"></Dropdown>
                                    {submitted && !category.parent_category && <small className="p-invalid">Parent Category Name is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="description">Seo Description</label>
                                    <InputTextarea id="description" value={category.cat_desc} onChange={(e) => onInputChange(e, "cat_desc")} className={classNames({ "p-invalid": submitted && !category.cat_desc })} required rows={3} cols={20} />
                                    {submitted && !category.cat_desc && <small className="p-invalid">Seo description is required.</small>}
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="field">
                                    <label htmlFor="categorySlug">Category Slug</label>
                                    <InputText id="categorySlug" value={category.cat_slug} onChange={(e) => onInputChange(e, "cat_slug")} required className={classNames({ "p-invalid": submitted && !category.cat_slug })} />
                                    {submitted && !category.cat_slug && <small className="p-invalid">Category Slug is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="categoryTitle">Seo Title</label>
                                    {/* <Dropdown id="categoryTitle" options={categories} value={parentCategory} onChange={(e) => onInputChange(e,'categoryTitle')} optionLabel="name"></Dropdown> */}
                                    <InputText id="categoryTitle" value={category.cat_title} onChange={(e) => onInputChange(e, "cat_title")} required className={classNames({ "p-invalid": submitted && !category.cat_title })} />
                                    {submitted && !category.cat_title && <small className="p-invalid">Seo Title is required.</small>}
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {category && (
                                <span>
                                    Are you sure you want to delete <b>{category.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {category && <span>Are you sure you want to delete the selected products?</span>}
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

export default React.memo(Categories, comparisonFn);
