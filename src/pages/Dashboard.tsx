import styles from '../styles/pages/Dashboard.module.css';

import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast'
import { gql, useMutation } from '@apollo/client'


// Mutation for creating a board
// NOTE: Nhost does not allow the use of 'insert_boards_one' or the use of 'returning' in the mutation response.
const CREATE_BOARD = gql`
  mutation ($private: Boolean, $background_value: String, $description: String, $name: String, $created_by: uuid, $background_is_image: Boolean) {
    insert_boards(objects: {private: $private, background_value: $background_value, description: $description, name: $name, created_by: $created_by, background_is_image: $background_is_image, members: {data: [{user_id: $created_by}]}}) {
        affected_rows
    }
  }
`

const Dashboard = () => {
    const { user }: any = useOutletContext();
    const [mutateBoard, { loading }] = useMutation(CREATE_BOARD)
    
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
        onSubmit: async (values: any) => {
            values.private = (values.private.length > 0)
            console.log(values)
            try {
                await mutateBoard({
                    variables: {
                        name: values.name,
                        description: values.description,
                        created_by: user.id,
                        //user_id: user.id,
                        private: values.private,
                        background_is_image: false,
                        background_value: values.background
                    },

                    onCompleted: () => {
                        toast.success('Board created', { id: 'createBoard' })
                    },
                    onError: (apolloError) => {
                        toast.error('Unable to create board', { id: 'createBoard' })
                        console.log(apolloError)
                    }
                })
                
            } catch (error) {
                toast.error('Unable to create board', { id: 'createBoard' })
            }
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
