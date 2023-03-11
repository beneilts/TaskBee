import styles from '../styles/components/Avatar.module.css';
import {
    UserIcon,
} from '@heroicons/react/outline';

const defaultUrl = "https://s.gravatar.com/avatar/1d7853465e033165688e1bcb3abc018e?r=g&default=blank"

const Avatar = ({ src, alt }: { src: string, alt: string }) => (
    <div className={styles.avatar}>
        {src && src != defaultUrl ? <img src={src} alt={alt} /> : <UserIcon className='text-[#6b7280] w-2/3' />}
    </div>
);

export default Avatar;
