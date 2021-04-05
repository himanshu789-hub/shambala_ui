import React from 'react';
import { Link } from 'react-router-dom';

import './Nav.css';
const Nav = React.memo(function Nav() {
	return (
		<nav id='navigation' className='bg-dark'>
			<ul className='nav' id='menu'>
				<li className='nav-item parent'>
					<Link className='nav-link' to='/incoming'>
						<span className='d-inline-flex flex-column align-items-center'>
							<i className='fa fa-ship fa-2x'></i>
							<label>Incoming</label>
						</span>
					</Link>
					<ul className='dropdown-menu child'>
						<li className='dropdown-item'>
							<Link to='/incoming/add' className='nav-link'>
								<i className='fa fa-plus'></i> Add
							</Link>
						</li>
						<li className='dropdown-item'>
							<Link to='/incoming/search' className='nav-link'>
								<i className='fa fa-list-alt'></i> Search
							</Link>
						</li>
					</ul>
				</li>
				<li className='nav-item parent'>
					<Link className='nav-link' to='#'>
						<span className='d-inline-flex flex-column justify-content-center align-items-center'>
							<i className='fa fa-cubes fa-2x'></i>
							<label>Customer</label>
						</span>
					</Link>
					<ul className='child dropdown-menu'>
						<li className='dropdown-item'>
							<Link to='/incoming/add' className='nav-link' >
							<i className='fa fa-plus'></i> Add
                            </Link>
						</li>
						<li className='dropdown-item'>
							<Link to='/incoming/search' className='nav-link' >
							<i className='fa fa-list-alt'></i> Search
                            </Link>
						</li>
					</ul>
				</li>
				<li className='nav-item parent'>
					<a className='nav-link' href='#'>
						<span className='d-inline-flex flex-column justify-content-center align-items-center'>
							<i className='fa fa-street-view fa-2x'></i>
							<label>Salesman</label>
						</span>
					</a>
					<ul className='child dropdown-menu'>
						<li className='dropdown-item'>
							<Link to='/incoming/add' className='nav-link' >
							<i className='fa fa-plus'></i> Add
                            </Link>
						</li>
						<li className='dropdown-item'>
							<Link to='/incoming/search' className='nav-link' >
							<i className='fa fa-list-alt'></i> Search
                            </Link>
						</li>
					</ul>
				</li>
							<li className='nav-item parent'>
					<a className='nav-link' href='#'>
						<span className='d-inline-flex flex-column justify-content-center align-items-center'>
							<i className='fa fa-truck fa-2x'></i>
							<label>Outgoing</label>
						</span>
					</a>
					<ul className='child dropdown-menu'>
						<li className='dropdown-item'>
							<Link to='/outgoing/add' className='nav-link' >
							<i className='fa fa-plus'></i> Add
                            </Link>
						</li>
						<li className='dropdown-item'>
							<Link to='/outgoing/search' className='nav-link' >
							<i className='fa fa-list-alt'></i> Search
                            </Link>
						</li>
					</ul>
				</li>
					<li className='nav-item parent'>
					<a className='nav-link' href='#'>
						<span className='d-inline-flex flex-column justify-content-center align-items-center'>
							<i className='fa fa-shopping-bag fa-2x'></i>
							<label>Invoices</label>
						</span>
					</a>
					<ul className='child dropdown-menu'>
						<li className='dropdown-item'>
							<Link to='/invoice/add' className='nav-link' >
							<i className='fa fa-plus'></i> Add
                            </Link>
						</li>
						<li className='dropdown-item'>
							<Link to='/invoice/search' className='nav-link' >
							<i className='fa fa-list-alt'></i> Search
                            </Link>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	);
});
export default Nav;
