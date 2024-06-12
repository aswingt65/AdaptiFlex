import Image from "next/image";
import Link from "next/link";
// import logo from '../../../public/footerlogo.svg'
// import github from '../../../public/githublogo.svg'

export default function footer() {
    return (
        <footer className="fixed bottom-0 w-full p-5 pt-2 pb-2 ">
            <hr />
            <div className="flex justify-between p-2">
                {/* <Image
                    src={logo}
                    alt="Adaptiflex Logo"
                    width={100}
                    height={100}
                    className="w-7 h-7"
                />
                <Link href="#" target="_blank">
                    <Image
                        src={github}
                        alt="GitHub Logo"
                        width={100}
                        height={100}
                        className="w-7 h-7"
                    />
                </Link> */}
            </div>
        </footer>
    )
}
