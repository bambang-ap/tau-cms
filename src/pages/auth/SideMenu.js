import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actionUi from 'src/redux/actions/ui';
import { Link } from 'react-router-dom';
import { Container, View, ScrollView } from 'src/components/Container';
import { ButtonOpacity } from 'src/components/Button';


const SideMenu = () => {
	const dispatch = useDispatch()
	const { Web, UI: { data: { sideMenu } } } = useSelector(state => state)
	const [subMenuOpen, setSubMenuOpen] = useState({})

	const openSubMenu = (id) => {
		let menu = { ...subMenuOpen }
		let parent = id.split('-').filter(a => a !== "").map(a => a + "-")
		parent.forEach((a, i) => {
			parent[i] = (parent[i - 1] || "") + parent[i]
			menu[parent[i]] = true
		})
		setSubMenuOpen({ ...menu, [id]: !subMenuOpen[id] })
	}

	const MenuView = ({ name, viewPath, icon }) => <View justify={Web.minimizedDrawer && 'c'} direction="row"
		className={`view-link ai-c ta-l ${window.location.href.includes(viewPath) ? 'c-link' : 'c-dark'}`}>
		<i className={`ta-c w-13 ${icon || 'fa fa-home'} ${Web.minimizedDrawer ? 'f-10' : 'f-7'}`} />
		{!Web.minimizedDrawer && name}
	</View>

	const renderSideMenu = (arr, id = "", prevPath = "") => {
		return arr.rMap(
			(obj, i) => {
				const { name, path, icon, subMenu } = obj
				const viewId = (id + name + "-").replace(/\s/g, '')
				const viewPath = prevPath + path
				const props = { name, viewPath, icon }
				return subMenu ?
					<>
						<ButtonOpacity key={i} justify={Web.minimizedDrawer ? 'c' : 'sb'} className="bc-light ai-c pb-5" onClick={() => openSubMenu(viewId)}>
							<MenuView {...props} />
							{!Web.minimizedDrawer && <i className={`pr-2 ion-ios-arrow-${subMenuOpen[viewId] ? 'up' : 'right'}`} />}
						</ButtonOpacity>
						<View key={`${i}${i}`} className={`${!Web.minimizedDrawer && 'pl-5'} pt-0 bc-light sub-menu`} style={{ height: subMenuOpen[viewId] ? 'auto' : 0 }}>
							{renderSideMenu(subMenu, viewId, viewPath)}
						</View>
					</> :
					<>
						<Link className={`flex-1 pb-5 ${Web.minimizedDrawer ? 'jc-c' : 'jc-sb'} bc-light`} key={i} to={{ pathname: viewPath, state: obj }}>
							<MenuView {...props} />
						</Link>
					</>
			}
		)
	}

	useEffect(() => {
		dispatch(actionUi())
	}, [dispatch])

	return <Container style={{ ...Web.minimizedDrawer && { width: 'auto' } }} className='bc-light w-1/4'>
		<View direction="row" className="p-5">
			<img className="h-full w-auto" alt="" src={Web.minimizedDrawer ? require('src/assets/images/favicon.png') : require('src/assets/images/logo-tau.png')} />
		</View>
		{!Web.minimizedDrawer && <div className="p-5 pt-1">
			<img className="h-auto w-15" alt="" src={require('src/assets/images/Laki-laki.svg')} />
			<div className="pt-3">Superadmin</div>
		</div>}
		<ScrollView bottom={<View flex className="bc-light" />} className="side-menu p-3">
			{sideMenu && renderSideMenu(sideMenu)}
		</ScrollView>
	</Container >
}

export default SideMenu