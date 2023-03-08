import styles from '../styles/pages/Dashboard.module.css';

import { useOutletContext, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast'
import { gql, useMutation } from '@apollo/client'
import { background_colors } from '../resources/background_colors';
import { XIcon, CheckIcon } from '@heroicons/react/solid';

// Mutation for creating a board
// NOTE: Nhost does not allow the use of 'insert_boards_one' or the use of 'returning' in the mutation response.
const CREATE_BOARD = gql`
  mutation ($private: Boolean, $background_value: String, $description: String, $name: String, $created_by: uuid, $background_is_image: Boolean) {
    insert_boards_one(object: {private: $private, background_value: $background_value, description: $description, name: $name, created_by: $created_by, background_is_image: $background_is_image, members: {data: [{user_id: $created_by}]}}) {
        id
    }
  }
`

const CreateBoard = ({closeClicked} : {closeClicked:() => void}) => {
    const { user }: any = useOutletContext()
    const [mutateBoard, { loading }] = useMutation(CREATE_BOARD)
    const navigate = useNavigate()
    
    const formik = useFormik({
        initialValues: {
            background: background_colors[0],
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
                        private: values.private,
                        background_is_image: false,
                        background_value: values.background
                    },

                    onCompleted: (data) => {
                        //toast.success('Board created', { id: 'createBoard' })
                        navigate(`/boards/${data.insert_boards_one.id}`)
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
        <div className='fixed z-10 inset-0 overflow-y-auto'>
            <div className='flex items-center justify-center'>
                <div className="fixed inset-0 bg-gray-500 opacity-40"></div>
                
                <div className='bg-white mt-10 w-80 rounded-md overflow-hidden shadow-xl transform transition-all'>
                    <button onClick={closeClicked} className='w-6 absolute top-0 right-0 mt-1 mr-1'><XIcon /></button>
                    <h2 className="text-lg text-center mt-2">Create a board</h2>
                    
                    <form onSubmit={formik.handleSubmit} className='flex flex-col p-5'>
                            <div className='text-gray-700 flex flex-col space-y-4'>
                                <div className=''>
                                    <label className='block font-mono font-bold pb-2' htmlFor='background'>Background</label>
                                    <div className='flex space-x-2'>
                                        {background_colors.map((color:string, index) => 
                                            <button key={index} type='button' style={{backgroundColor: color}} 
                                                className='w-10 h-8 rounded-md text-white'
                                                onClick={() => formik.setFieldValue('background', color)}
                                                >
                                                {color == formik.values.background ? <CheckIcon className='mx-3'/> : null}
                                            </button>)}
                                    </div>
                                </div>
                                <div className=''>
                                    <label
                                        className={`block font-mono font-bold pb-2 ${formik.touched.name && formik.errors.name ? 'text-red-400' : ''}`}
                                        htmlFor='name'
                                    >
                                        {formik.touched.name && formik.errors.name ? formik.errors.name : "Board name"}
                                    </label>
                                    <input
                                        className='border-2 border-gray-500 p-2 rounded-md w-max'
                                        type='text'
                                        name='name'
                                        placeholder='Enter a name'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                </div>
                                <div className=''>
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
                                <div className='flex space-x-2'>
                                    <input className='border-2 border-gray-500 p-2 rounded-md'
                                        type='checkbox'
                                        name='private'
                                        onChange={formik.handleChange}
                                    />
                                    <label className='block font-mono font-bold' htmlFor='private'>Private</label>
                                </div>
                            </div>
                            <button type='submit' className='bg-blue-500 text-white w-60 py-3 mt-6 rounded-lg self-center'>Create Board</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateBoard