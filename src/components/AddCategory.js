import React, { useRef, useState } from 'react';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import Axios from "axios";
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";

function AddCategory() {
    const [addCategory, setAddCategory] = useState("");
    const [parentCategory, setParentCategory] = useState("");
    const [categoryDesc, setCategoryDesc] = useState("");
    const [categorySlug, setCategorySlug] = useState("");
    const [categoryTitle, setCategoryTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");

    const toast = useRef();

    const categories = [
        { name: "Anxiety", value: "anxiety" },
        { name: "Healthy Lifestyle", value: "healthylifestyle" },
        { name: "none", value: "0" },
    ];

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'Success Message', detail: 'Successfully entered', life: 3000 });
    };

    const showError = () => {
        toast.current.show({ severity: 'error', summary: 'Error Message', detail: 'Something wrong', life: 3000 });
    };

    const addCategoryFunction = () => {
        Axios.post("http://192.168.0.143:5000/category", { name: addCategory, parentName: parentCategory, categoryDesc: categoryDesc, CategorySlug: categorySlug, CategoryTitle: categoryTitle, metaDesc: metaDescription}).then((res) => {
            res ? showSuccess(): showError()
        });
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Category Page</h5>
                    <div className="grid">
                        <div className="col-6">
                            <div className="grid p-fluid mt-3">
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <InputText type="text" id="addcategory" value={addCategory} onChange={(e) => setAddCategory(e.target.value)} />
                                        <label htmlFor="addcategory">Category name</label>
                                    </span>
                                </div>
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <Dropdown id="dropdown" options={categories} value={parentCategory} onChange={(e) => setParentCategory(e.value)} optionLabel="name"></Dropdown>
                                        <label htmlFor="dropdown">Dropdown</label>
                                    </span>
                                </div>
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <InputTextarea id="categoryDesc" rows="3" cols="30" value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)}></InputTextarea>
                                        <label htmlFor="categoryDesc">Category description</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="grid p-fluid mt-3">
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <InputText type="text" id="categorySlug" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} />
                                        <label htmlFor="categorySlug">Category slug</label>
                                    </span>
                                </div>
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <InputText type="text" id="categoryTitle" value={categoryTitle} onChange={(e) => setCategoryTitle(e.target.value)} />
                                        <label htmlFor="categoryTitle">Category title</label>
                                    </span>
                                </div>
                                <div className="field col-12">
                                    <span className="p-float-label">
                                        <InputTextarea id="metaDescription" rows="3" cols="30" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}></InputTextarea>
                                        <label htmlFor="metaDescription">Meta description</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Toast ref={toast} />
                    <Button onClick={addCategoryFunction} label="Submit" className="p-button-primary mr-2 mb-2" />
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(AddCategory, comparisonFn);
