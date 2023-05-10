import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { apiService } from '../service/apiServices';
import { format } from 'date-fns'

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: .4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: .4
        }
    ]
};

const Dashboard = (props) => {
    const [blogs, setBlogs] = useState(null);
    const [lineOptions, setLineOptions] = useState(null);
    const [stastics, setStastics] = useState({
        blogs: 0,
        products: 0,
        authors: 0,
        category:0
    })

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    useEffect(() => {
        const data = new apiService();
        data.getBlogsByDesc().then(data => setBlogs(data)); 
        getAllData()      
    }, []);

    const getAllData = async () => {
        const data = new apiService();

        let blogs = await data.getBlog().then(data => data.length);
        let products = await data.getProducts().then(data => data.length);
        let authors = await data.getAuthor().then(data => data.length);
        let category = await data.getCategory().then(data => data.length);

        setStastics({
            blogs,
            products,
            authors,
            category
        })
    }

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);


    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">All Blogs</span>
                            <div className="text-900 font-medium text-xl">{stastics.blogs}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-o text-blue-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">All Products</span>
                            <div className="text-900 font-medium text-xl">{stastics.products}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">All Authors</span>
                            <div className="text-900 font-medium text-xl">{stastics.authors}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-cyan-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">All category</span>
                            <div className="text-900 font-medium text-xl">{stastics.category}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                            <i className="pi pi-comment text-purple-500 text-xl"/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Recent Blogs</h5>
                    <DataTable value={blogs} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Image" body={(data) => <img className="shadow-2" src={`assets/demo/images/gallery/${data.feature_image}`} alt={data.feature_image} width="50" />} />
                        <Column field="blog_title" header="Blog title" sortable style={{ width: '35%' }} />
                        <Column field="blogdate" header="Date" sortable style={{ width: '35%' }} body={(data) => {
                            let productDate = new Date(data.blogdate);
                            const result = format(productDate, 'dd/MM/yyyy')
                            return (
                                <>{result}</>
                            )
                        }} />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sales Overview</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Dashboard, comparisonFn);
