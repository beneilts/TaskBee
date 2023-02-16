import styles from '../styles/pages/Dashboard.module.css';

import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Dashboard = () => {
    const { user } = useOutletContext();
    const formik = useFormik({
        initialValues: {
            background: '#000000',
            name: '',
            description: '',
            private: []
        },

        // Validate form
        validationSchema: Yup.object({
            name: Yup.string().max(20, 'Name must be 20 characters or less.').required("Name is required.")
        }),

        // Submit form
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return (
        <>
            <Helmet>
                <title>Dashboard - Nhost</title>
            </Helmet>

            <div>
                <h2 className={styles.title}>Create a board</h2>

                <main className='h-screen flex items-center justify-left'>
                    <form onSubmit={formik.handleSubmit} className='bg-gray-100 flex rounded-lg w-1/2'>
                        <div className='flex-1 text-gray-700 p-20'>
                            <div className='mt-6'>
                                <div className='pb-4'>
                                    <label className='block font-mono font-bold pb-2' htmlFor='background'>Background</label>
                                    <input
                                        className='border-2 border-gray-500 p-2 rounded-md'
                                        type='color'
                                        name='background'
                                        value={formik.values.background}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className='pb-4'>
                                    <label 
                                        className={`block font-mono font-bold pb-2 ${formik.touched.name && formik.errors.name ? 'text-red-400' : ''}`} 
                                        htmlFor='name'
                                    >
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Board name"}
                                    </label>
                                    <input 
                                        className='border-2 border-gray-500 p-2 rounded-md' 
                                        type='text' 
                                        name='name' 
                                        placeholder='Enter a name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className='pb-4'>
                                    <label className='block font-mono font-bold pb-2' htmlFor='description'>Description</label>
                                    <input 
                                        className='border-2 border-gray-500 p-2 rounded-md' 
                                        type='text' 
                                        name='description' 
                                        placeholder='Enter a description'
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className='pb-4'>
                                    <label className='block font-mono font-bold pb-2' htmlFor='private'>Private</label>
                                    <input className='border-2 border-gray-500 p-2 rounded-md'
                                        type='checkbox'
                                        name='private'
                                        onChange={formik.handleChange}
                                    />
                                </div>
                            </div>
                            <button type='submit' className='bg-blue-500 text-white w-1/4 py-3 mt-6 rounded-lg '>Create Board</button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
};

export default Dashboard;
