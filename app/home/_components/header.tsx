import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/adaptiFlex.svg';

const Header = () => {
    return (
        <header className="p-4 fixed top-0">
            <Link
                href={'/home'}
                className="w-full flex gap-1 justify-left items-center"
            >
                <Image
                    src={logo}
                    alt="Adaptiflex Logo"
                    width={45}
                    height={45}
                />
                <span className="font-semibold dark:text-white">
                    Adapti<span className='text-[#FF471F]'>Flex.</span>
                </span>
            </Link>
        </header>
    );
};

export default Header;