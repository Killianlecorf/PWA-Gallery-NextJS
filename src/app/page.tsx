'use client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import './index.scss'

export default function Home() {

  const token = Cookies.get('token');
  
  const displayToken = () => {
    if (!token) {
      return (
        <div className='displayConnexionButton'>
          <Link href='/login'>
            <button>Login</button>
          </Link>
          <Link href='/register'>
            <button>Register</button>
          </Link>
        </div>
      )
    }
    return (
        <div className='displayConnexionButton'>
            <button>Delete user</button>
        </div>
    );
  }

  return (
    <main className='mainPage'>
      {displayToken()}
      <h1>Galery Picture</h1>
    <div className="allGalery">
      <div className="privateGalery">
        <h2>Private galery</h2>
      </div>
      <div className="publicGalery">
        <h2>Public galery</h2>
      </div>
    </div>
    </main>
  );
}