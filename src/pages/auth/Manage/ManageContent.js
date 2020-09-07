import React, { useState, useEffect } from 'react';
import { View } from 'src/components/Container';
import FileUpload from 'src/components/FileUpload';
import Button from 'src/components/Button';
import { getManage, updateManage, FILE_PATH } from 'src/utils/api';
import { setTitle } from 'src/redux/actions/web';
import JoditEditor from 'jodit-react';
import { joditConfig } from 'src/utils/state';

let winState = {}

const ManageContent = ({ location: { state: param }, match: { params } }) => {
	const [state, _] = useState({ image: '' })
	const setState = v => _({ ...winState, ...v })
	const updateData = async () => {
		const data = { ...state }
		if (param.withImage) {
			const validImg = await data.image.checkImageValid()
			if (!validImg) {
				data.imageNotChange = true
			}
		} else {
			data.imageNotChange = true
		}
		const { data: resp } = await updateManage(data)
		alert(resp)
	}
	const getData = async () => {
		let { data, status } = await getManage({ part: params.path })
		if (param.withImage) data.image = data.image === 'null' ? null : data.image
		if (status) {
			setState(data)
		}
	}
	useEffect(() => {
		getData()
		setTitle(param.title)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [param])
	winState = state
	return <View flex>
		<View flex className="mb-3">
			{param.withImage && <FileUpload
				isImage
				toBase64
				imgClass="b-1 w-auto h-full"
				accept="image/*"
				className="h-35 mr-3 mb-3"
				src={state.image.length > 50 ? state.image : FILE_PATH + state.image}
				onChange={({ file: image }) => setState({ image })}
			/>}
			<JoditEditor
				value={state.content}
				config={joditConfig}
				tabIndex={1}
				onBlur={e => setState({ content: e.target.innerHTML })}
			/>
		</View>
		<Button className="as-fe" onClick={updateData}>Update data</Button>
	</View>
}

export default ManageContent