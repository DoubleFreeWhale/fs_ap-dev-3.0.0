<template>
	<div class="ifbp-material-list">
		<!-- 材料清单 -->
		<div class="material-file-list" v-if="type==='list'">
			<div class="material-group" v-for="(groupItem, groupIndex) in groupList.detailList" :key="groupIndex">
				<div>
					<span class="material-group__title">{{groupItem.materialGroupName}}</span>
					<span class="material-group__line"></span>
				</div>
				<div style="display: flex; flex-wrap: wrap;margin-left: -5px;">
					<div class="ifbp-upload" v-for="(fileItem, fileIndex) in groupItem.fileList" :key="fileIndex" :style="{width: `${parseInt(itemWidth)+2}px`,display:(unableUpload && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']?'none':'block')}">
						<div class="ifbp-upload__body">

							<div class="ifbp-upload__box" :style="{width: `${parseInt(itemWidth)+2}px`,  height:( getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'])? `${parseInt(itemHeight)+121}px` : `${itemHeight}px`} ">
								<!-- 单文件已上传 -->
								<div v-if="fileItem.isUploadCopies !=='是' &&  getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']" :style="{position:'relative',width: `${itemWidth}px`, height: `${itemHeight}px` }">
									<div class='ifbp-file__uplaod_icon' :style="{borderWidth : getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode )['fileType'] === 'IMAGE' ? 0 : 1+'px' }    ">
										<img :id="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['pkMaterialFile']" v-if="fileItem.isUploadCopies !=='是'&& getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'] && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode
			                            )['fileType'] === 'IMAGE' && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['uploading'] " :src="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']" :style="getImgMessage(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode))" @click="handlePreview(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)">
										<img v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['uploading']" :style="{'margin-top':`${(itemWidth-32)/2}px`}" src='../images/loading.gif'>

										<i v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'] && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode
				                            )['fileType'] !== 'IMAGE' && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['uploading'] " :class="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']" :style="{fontSize: '32px',background: getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['preViewBK'],color: 'WHITE',padding: '16px',transform: 'translateY(50%)'}"></i>
									</div>
									<!--	<div class = 'filematerialname' >
										{{fileItem.materialName }}/////
									</div>-->

									<!-- 没有上传文件 -->
									<!-- 禁用上传 -->
									<div v-show="fileItem.isUploadCopies !=='是'&& disableUpload && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']" class="ifbp-upload__content disabled">
										<span>禁止上传</span>
										<div :class="['el-upload__text', {'required': fileItem.isNecessary === '是'}]" v-if="fileItem.materialName">{{fileItem.materialName}}</div>
									</div>
								</div>
								<div class="filematerialname_1" v-if="fileItem.isUploadCopies !=='是' && !fileItem.editable && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									{{fileItem.materialName }}
								</div>
								<div class='ifbp-file-materialname' :title="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['fileName']" v-if="fileItem.isUploadCopies !=='是'&& !fileItem.editable && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									{{getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['fileName']}}
								</div>
								<div class='ifbp_file_message' v-if="fileItem.isUploadCopies !=='是'&& !fileItem.editable && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'] && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode).uploading">
									{{getSize(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['size'])}} {{getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['userName'] ? '&nbsp;&nbsp;|&nbsp;&nbsp;' + getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['userName'] : '' }} <br /> {{formatDate(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['ts'])}}
								</div>
								<div class='ifbp_file_message' v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode).uploading">
									{{parseInt(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['percent'])+"%"}}
								</div>

								<div class="textarea" v-if="fileItem.isUploadCopies !=='是'&&  fileItem.editable && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									<textarea :id='fileItem.pkMaterialDetail+"textarea"' :style="{width: `${parseInt(itemWidth)-6}px`}">{{getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['fileName']}}</textarea>
								</div>
								<div style='height: 32px;line-height: 32px;' v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['checkedSign']">

									<i class='signclass' v-for="itx in getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['checkedSign']">{{itx}}</i>
								</div>
								<div class="ifbp_file_icon" v-if="fileItem.isUploadCopies !=='是'&&  !fileItem.editable && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'] && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['uploading']">
									<i class="ifbp-icon-edit" v-if='!disableUpdate' title='编辑' @click="handleUpdateList(fileItem,groupIndex,fileIndex,'update')"></i>
									<i class="ifbp-icon-visibility" title='预览' v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode
			                            )['fileType'] !== 'IMAGE'" @click="handleVisibility(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode))"></i>

									<i class="el-icon-delete" title='删除' v-if="!disableDelete" @click="handleRemove(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)"></i>
									<!--<i class = "ifbp-icon-check_circle_outline" title = '标记' @click = "signUpload(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)"></i>-->
									<a class="download-a" title='下载' v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['fileUrl']" @click="downloadFile(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode))" :download="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['fileName'] || getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['fileUrl']">
										<i class="el-icon-pt-xiazai"></i>
									</a>
								</div>
								<div class="ifbp_file_icon" v-if="fileItem.isUploadCopies !=='是'&&  fileItem.editable && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									<span @click="updateFileNameMulity(groupList.fileMap,fileItem.materialGroupCode+','+fileItem.materialNameCode,groupIndex,fileIndex)">确定</span>
									<span @click="handleUpdateList(fileItem,groupIndex,fileIndex,'cancel')">取消</span>
								</div>

								<!-- 单文件未上传 -->
								<el-upload 
									v-show = "fileItem.isUploadCopies !=='是'  && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']" 
									style="width: 100%; height: 100%" 
									:data="realData[groupIndex] ? realData[groupIndex][fileIndex] : {}" 
									:disabled='disableUpload' 
									list-type="picture-card" 
									ref="formRef" 
									:show-file-list="false" 
									:http-request="checkFile" 
									:on-success="function(res, file, fileList){handleSuccess(res, file, fileList, groupList.fileMap, fileItem,'',groupIndex,fileIndex)}" 
									:on-error="function(error, file, fileList){onError(error, file, fileList, groupList.fileMap,fileItem)}" 
									:on-change="onChange" :before-upload="function(file){beforeUpload(file,groupIndex,fileIndex)}" 
									:on-progress="function(event,file,fileList){handleProgress(event,file,fileList,'multi',groupIndex,fileIndex)}" 
									:action="action" 
									:multiple="false">
									<div class="ifbp-upload__content">
										<i class="el-icon-plus" v-if=" !disableUpload"></i>
										<div :title="fileItem.materialName" :class="['el-upload__text', {'required': fileItem.isNecessary === '是'}]" v-if="fileItem.materialName">{{fileItem.materialName}}</div>
									</div>
								</el-upload>

								<!-- isUploadCopies为是  多文件 -->
								<!-- 多文件已上传 显示一个文件   点击打开 dialog-->
								<div :style="{position:'relative',width: `${itemWidth}px`, height: `${itemHeight}px` }" @click='uploadMulti(fileItem,groupIndex,fileIndex,"open")' v-if="fileItem.isUploadCopies === '是'  && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									<div class='ifbp-file__uplaod_icon'>
										<img :id="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['pkMaterialFile']+'imag'" v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'] && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode
			                            )['fileType'] === 'IMAGE'" :style="getImgMessage(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode),'all')" :src="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
										<i v-if="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl'] && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode
			                            )['fileType'] !== 'IMAGE'" :class="getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']" :style="{fontSize: '32px',background: getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['preViewBK'],color: 'WHITE',padding: '16px',transform: 'translateY(50%)'}"></i>
									</div>
									<div class='identify_mulity' v-if="fileItem.isUploadCopies === '是'  && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
										<i class='ifbp-icon-page-empty' style='font-size: 16px;vertical-align: bottom;'></i>
										<span style='font-size: 14px;'>{{groupList.fileMap[fileItem.materialGroupCode+','+fileItem.materialNameCode].length}}</span>
									</div>

								</div>
								<div class='ifbp-file-materialname' v-if="fileItem.isUploadCopies === '是'  && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									{{fileItem.materialName}}
								</div>
								<div class='ifbp_file_message' v-if="fileItem.isUploadCopies === '是'  && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">

									{{getSize(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['size'])}} {{getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['userName'] ? '&nbsp;&nbsp;|&nbsp;&nbsp;'+getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['userName'] : '' }} <br /> {{formatDate(getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['ts'])}}
								</div>
								<div class='ifbp_file_icon' v-if="fileItem.isUploadCopies === '是'  && getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									<i class="el-icon-delete" @click.stop="deleteAll(fileItem.materialGroupCode+','+fileItem.materialNameCode)" title='批量删除' v-if="!disableDelete && groupItem.flag !== 'old'"></i>
									<i @click.stop="downloadAll(fileItem.materialGroupCode+','+fileItem.materialNameCode)" title='批量下载' class="ifbp-icon-save-alt"></i>
								</div>

								<!-- 多文件未上传 点击打开dialog -->
								<div :style="{width: `${itemWidth}px`, height: `${itemHeight}px`}" class='ifbp-upload-more' @click='uploadMulti(fileItem,groupIndex,fileIndex,"open")' v-show=" fileItem.isUploadCopies === '是'  && !getFile(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode)['previewUrl']">
									<div class="ifbp-upload__content">
										<i class="ifbp-icon-library-add" v-if="!disableUpload"></i>
										<div :title="fileItem.materialName" :class="['el-upload__text', {'required': fileItem.isNecessary === '是'}]" v-if="fileItem.materialName">{{fileItem.materialName}}</div>
									</div>
								</div>

								<!-- dialog 显示多个文件-->
								<el-dialog :visible.sync="fileItem.dialogUpload" custom-class='upload_multi' @visible-change='closeDialog($event,groupIndex,fileIndex)'>
									<button @click="goleft(fileIndex)" v-if="getLeftShow()" class="el-carousel__arrow el-carousel__arrow--left"><i class="el-icon-arrow-left"></i></button>
									<button @click="goright(fileIndex)" v-if="getRightShow(groupList.fileMap[fileItem.materialGroupCode+','+fileItem.materialNameCode])" class="el-carousel__arrow el-carousel__arrow--right"><i class="el-icon-arrow-right"></i></button>
									<div :id="'transx'+fileIndex" style="display: flex;flex-wrap: nowrap;">
										<div class="ifbp-upload__body" v-if="!disableUpload" :style="{width: `${itemWidth*2}px`, height: `${itemHeight*2}px`,'margin-right':'8px'}">
											<div class="ifbp-upload__box" :style="{width: `${itemWidth*2}px`, height: `${itemHeight*2}px`, 'text-align': 'center'}">
												<el-upload 
													class="upload-dialog" 
													:style="{width: `${itemWidth*2}px`, height: `${itemHeight*2}px`, 'line-height': `${itemHeight*2}px`}" 
													:data="realData[groupIndex] ? realData[groupIndex][fileIndex] : {}" 
													:action="action" multiple :disabled="disableUpload || groupItem.flag == 'old'" 
													list-type="picture-card" 
													:show-file-list="false" 
													:file-list="normalFileListBase" 
													:http-request="checkFile" 
													:on-success="function(res, file, fileList){handleSuccess(res, file, fileList, groupList.fileMap, fileItem,'multi',groupIndex,fileIndex)}" 
													:on-change="onChange" :before-upload="function(file){beforeUpload(file,groupIndex,fileIndex,'multy')}" 
													:on-progress="function(event,file,fileList){handleProgress(event,file,fileList,'multi',groupIndex,fileIndex)}" 
													:on-error="function(error, file, fileList){onError(error, file, fileList,groupList.fileMap,fileItem,'multi')} ">
													<i class="el-icon-plus"></i>
												</el-upload>
											</div>
										</div>
										<div class='ifbp-upload__body' :style="{width: `${itemWidth*2}px`, height: `${parseInt(itemHeight*2)+137}px`,'margin-right':'8px'}" v-for="(it,inx) in groupList.fileMap[fileItem.materialGroupCode+','+fileItem.materialNameCode]">
											<div class="ifbp-upload__box1">
												<div :style="{position:'relative',width: `${itemWidth*2}px`, height: `${itemHeight*2}px` }">
													<div class='ifbp-file__uplaod_icon' :style="{borderWidth : it.fileType === 'IMAGE' ? 0 : 1+'px' }    ">
														<img :id='it && it.pkMaterialFile ? (it.pkMaterialFile+"img") :""' v-if="it && it.previewUrl && it.fileType === 'IMAGE' && !it.uploading && fileItem.dialogUpload" :src="it ? it.previewUrl : ''" :style="getImgMessage(it,'multi')" @click="handlePreview(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode,inx)">
														<i v-if="it && it.previewUrl && it.fileType!=='IMAGE' && !it.uploading" :class="it && it.previewUrl ? it.previewUrl : ''" :style="{fontSize: '64px',background: it.preViewBK,color: 'WHITE',padding: '32px',transform: 'translateY(50%)'}">
														</i>
														<img v-if='it.uploading' :style="{'margin-top':`${(itemWidth*2-32)/2}px`}" src='../images/loading.gif'>
													</div>
												</div>
											</div>
											<div class='ifbp-file-materialname' :title="it.fileName" v-show="it && !it.editable">

												{{it && it.fileName ? it.fileName :''}}
											</div>
											<div class="textarea" v-if="it && it.editable && fileItem.dialogUpload">
												<textarea :id='it && it.pkMaterialFile? it.pkMaterialFile+"textarea" :""' :style="{width: `${parseInt(itemWidth * 2)-6}px`}">{{it && it.fileName ? it.fileName :''}}</textarea>
											</div>
											<div class='ifbp_file_message' v-show="it && !it.editable && !it.uploading">
												{{getSize(it['size'])}} {{it.userName ? '&nbsp;&nbsp;|&nbsp;&nbsp;' + it.userName : '' }} <br /> {{formatDate(it['ts'])}}
											</div>
											<div class='ifbp_file_message' v-show="it && it.uploading">
												{{parseInt(it['percent'])+'%'}}
											</div>
											<div style='height: 32px;line-height: 32px;'>
												<i class='signclass' v-for='itx in it.checkedSign'>{{itx}}</i>
											</div>
											<div class="ifbp-upload-update" v-if="it && !it.editable && !it.uploading">
												<i class="ifbp-icon-edit" v-if='!disableUpdate && groupItem.flag !== "old"' title='编辑' @click="updateFileList(groupList.fileMap,fileItem.materialGroupCode+','+fileItem.materialNameCode,inx,'update')"></i>
												<i class="ifbp-icon-visibility" title='预览' v-if="it.fileType !== 'IMAGE'" @click="handleVisibility(it)"></i>

												<i class="el-icon-delete" title='删除' v-if="!disableDelete && groupItem.flag !== 'old'" @click="handleRemove(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode,inx,'mulity')" style="margin-right: 10px;"></i>
												<!--	<i class = "ifbp-icon-check_circle_outline" title = '标记' @click = "signUpload(groupList.fileMap, fileItem.materialGroupCode+','+fileItem.materialNameCode,inx)"></i>-->
												<a class="download-a" title='下载' v-if="it.fileUrl" @click="downloadFile(it)" :download="it.fileUrl" style="margin: 5px;">
													<i class="el-icon-pt-xiazai"></i>
												</a>
											</div>
											<div class="ifbp-upload-update" v-else>
												<span @click="updateListFileName(it,groupIndex,inx,fileItem.materialGroupCode+','+fileItem.materialNameCode)">确定</span>
												<span @click="updateFileList(groupList.fileMap,fileItem.materialGroupCode+','+fileItem.materialNameCode,inx,'cancel')">取消</span>
											</div>
										</div>
									</div>
								</el-dialog>
							</div>
							<!-- 显示单个文件 -->

						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 普通附件 -->
		<div class="normal-file-list" v-if="type==='normal' && !pkBpmNode && fileClass!=='new'" style="display: flex; flex-wrap: wrap;">
			<div class="ifbp-upload" v-for="(fileItem, fileIndex) in normalFileListBase" :key="fileIndex">
				<div class="ifbp-upload__body1" :style="{width: `${itemWidth}px`, height: `${parseInt(itemHeight)+105}px`}">
					<div class="ifbp-upload__box" :style="{'text-align': 'center',width: `${itemWidth}px`, height: `${itemHeight}px`,border: fileItem && fileItem['fileType'] !== 'IMAGE'? '1px solid #F0F0F5':'0px solid #F0F0F5'}">
						<!-- 图片展示 -->
						<img :id='fileItem.pkMaterialFile' v-if="fileItem['fileType'] === 'IMAGE' && !fileItem.uploading" :src="fileItem['previewUrl']" :style="getImgMessage(fileItem)" @click="handlePreview(fileItem)">
						<!--	<img :id='fileItem.pkMaterialFile+"1"'  v-if="fileItem['fileType'] === 'IMAGE' && !fileItem.uploading" 
					
							:src = "getBase64(fileItem['previewUrl'])"
							:style ="getImgMessage(fileItem)"
							@dblclick="handlePreview(fileItem)"
							>	-->

						<!-- 非图片文件展示文件类型图标及描述 -->

						<div class="ifbp-file__icon" v-if="fileItem['fileType'] !== 'IMAGE' && !fileItem.uploading">
							<i :class="fileItem['previewUrl']" :style="{fontSize: '32px',backgroundColor:fileItem.previewBK, color: 'WHITE',padding: '16px',transform: 'translateY(0%)'}">								
							 </i>

						</div>
						<img v-if='fileItem.uploading' :style="{'margin-top':`${(itemWidth-32)/2}px`}" src='../images/loading.gif'>
					</div>
					<!-- 上传之后下方材料名称     显示-->

					<div class='ifbp-upload-filename' v-if='!fileItem.editable'>{{fileItem.fileName}}</div>
					<div class='ifbp_file_message' v-if='!fileItem.editable && !fileItem.uploading'>
						{{getSize(fileItem['size']) }}{{fileItem.creator ? "&nbsp;&nbsp;|&nbsp;&nbsp;" + fileItem.creator : ''}} <br /> {{ fileItem['ts'] ? formatDate(fileItem['ts']) : ''}}
					</div>
					<div class='ifbp_file_message' v-if='fileItem.uploading'>
						{{isNaN(fileItem['percent']) ?fileItem['percent'] : "已上传" + parseInt(fileItem['percent'])+"%"}}
					</div>
					<div class="textarea" v-if='fileItem.editable'>
						<textarea :id='fileItem.pkMaterialFile+"textarea"' :style="{width: `${parseInt(itemWidth)-6}px`}">{{fileItem.fileName}}</textarea>

					</div>
					<div class="ifbp_file_icon" v-if='!fileItem.editable && !fileItem.uploading'>
						<i class="ifbp-icon-edit" title='编辑' v-if='!disableUpdate' @click="handleUpdate(fileItem,fileIndex,'update')"></i>
						<i class="ifbp-icon-visibility" title='预览' v-if="fileItem['fileType'] !== 'IMAGE'" @click="handleVisibility(fileItem)"></i>
						<i class="el-icon-delete" title='删除' v-if="!disableDelete" @click="handleRemove(fileItem, fileIndex)"></i>
						<a class="download-a" title='下载' v-if="fileItem.fileUrl" @click="downloadFile(fileItem)" :download="fileItem.fileName"><i class="el-icon-pt-xiazai"></i></a>
					</div>
					<div class="ifbp_file_icon" v-else>
						<span @click="updateFileName(fileItem,fileIndex)">确定</span>
						<span @click="handleUpdate(fileItem,fileIndex,'cancel')">取消</span>
					</div>

					<!-- 鼠标移上去的遮罩 -->
					<!--   <div class="hoverCard">
                    <div class="hoverCard__operateicon">
                        <i class="el-icon-view" title='查看' v-if="fileItem['fileType'] === 'IMAGE'" @click="handlePreview(fileItem)" style="margin-right: 10px;"></i>
                        <i class="el-icon-delete" title='删除' v-if="!disableDelete" @click="handleRemove(fileItem, fileIndex)" style="margin-right: 10px;"></i>
                        <a class="download-a" title='下载' v-if="fileItem.fileUrl" @click="downloadFile(fileItem)" :download="fileItem.fileName"><i class="el-icon-pt-xiazai"></i></a>
                    </div>
                </div>-->
				</div>
			</div>
			<!-- 上传 -->
			<div v-if="!disableUpload" class="ifbp-upload">
				<div class="ifbp-upload__body">
					<div class="ifbp-upload__box" :style="{width: `${itemWidth}px`, height: `${itemHeight}px`, 'text-align': 'center'}">
						<el-upload 
							class='normla_file_upload' 
							:style="{width: `${itemWidth}px`, height: `${itemHeight}px`, 'line-height': `${itemHeight}px`}" 
							:data="realData[0]" 
							:action="action" 
							multiple 
							list-type="picture-card" 
							:show-file-list="false" 
							:file-list="normalFileListBase" 
							:on-success="handleSuccess" 
							:http-request="checkFile" 
							:on-progress="function(event,file,fileList){handleProgress(event,file,fileList,'normal')}" 
							:on-change="onChange" 
							:before-upload="function(file){beforeUpload(file,'','','normal')}" 
							:on-error="onError">
							<i class="el-icon-plus"></i>
						</el-upload>
					</div>
				</div>
			</div>
		</div>
		<!-- 普通新版附件样式 -->
		<div class="normal-file-type" v-if="type==='normal' && !pkBpmNode && fileClass=='new'">
			<div class="normal-file-title" v-if="isShowTitle">
				<span>附件</span>
				<i @click='showUploadDrag()' class='ifbp-icon-plus-square el-icon-plus' style='color: #0089FA;'></i>
				<i @click="swithShowList('list')" class='ifbp-icon-view-module el-icon-pt-fenlei' :style="{position: 'absolute',top:20+'px',right: 0,color:normallist?'#75787B;':'#C8C8CD'}"></i>
				<i @click="swithShowList()" class='ifbp-icon-view-headline el-icon-pt-fenlei1' :style="{position: 'absolute',top:20+'px',right: 20+'px',color:!normallist?'#75787B;':'#C8C8CD'}"></i>
			</div>
			<div class='normal-filebody'>
				<el-upload class="upload-demo" 
					drag 
					:data="realData[0]" 
					:action="action" 
					:on-success="handleSuccess" 
					:http-request="checkFile" 
					:on-change="onChange" 
					:before-upload="function(file){beforeUpload(file,'','','normal')}" 
					:on-progress="function(event,file,fileList){handleProgress(event,file,fileList,'normal')}" 
					:on-error="onError" multiple>
					<i class="el-icon-upload"></i>
					<div class="el-upload__text">拖放文件至此以上传</div>

				</el-upload>
			</div>
			<div :class="normallist? 'normal-filelist' :'normal_filelist'">
				<div :class="normallist? 'normal-filelist-show' : 'normal_filelist-show'" v-for="(fileItem, fileIndex) in normalFileListBase" :key="fileIndex">
					<div :class="normallist?'normalicon':'normalicon_list'">

						<img v-if="fileItem['fileType'] === 'IMAGE' && !fileItem.uploading " :src="fileItem['previewUrl']" :class="normallist?'normalicon_img':'normalicon_list_img'" @click="handlePreview(fileItem)">
						<img v-if='fileItem.uploading' src='../images/loading.gif'>
						<!-- 非图片文件展示文件类型图标及描述 -->

						<div class="ifbp-file__icon" v-if="fileItem['fileType'] !== 'IMAGE' && !fileItem.uploading ">
							<i :class="fileItem['previewUrl']" :style="{fontSize: normallist?'32px':'16px',backgroundColor:fileItem.previewBK, color: 'WHITE',padding: normallist?'16px':'8px',transform: 'translateY(0%)'}">								
							 </i>

						</div>
					</div>
					<div :class="normallist?'normalfilename':'normalfilename_list'" v-if='!fileItem.editable'>
						{{fileItem.fileName}}

					</div>

					<div class="textarea" style='margin-top: 16px;' v-if='fileItem.editable'>
						<textarea :id='fileItem.pkMaterialFile+"textarea"' style="width:186px">{{fileItem.fileName}}</textarea>

					</div>

					<div class='ifbp_file_message' v-if='!fileItem.editable && !fileItem.uploading'>
						{{getSize(fileItem['size']) }}{{fileItem.creator ? "&nbsp;&nbsp;|&nbsp;&nbsp;" + fileItem.creator : ''}} <br /> {{ fileItem['ts'] ? formatDate(fileItem['ts']) : ''}}
					</div>
					<div class='ifbp_file_message' v-if='fileItem.uploading'>
						{{isNaN(fileItem['percent']) ?fileItem['percent'] : "已上传" + parseInt(fileItem['percent'])+"%"}}
					</div>

					<div :class="normallist ? 'ifbp_file_icon_normal':'ifbp_file_icon_normal_list'" v-if='!fileItem.editable && !fileItem.uploading'>
						<i class="ifbp-icon-edit" title='编辑' v-if='!disableUpdate' @click="handleUpdate(fileItem,fileIndex,'update')"></i>
						<i class="ifbp-icon-visibility" title='预览' v-if=" fileItem['fileType'] !== 'IMAGE'" @click="handleVisibility(fileItem)"></i>
						<i class="el-icon-delete" title='删除' v-if="!disableDelete" @click="handleRemove(fileItem, fileIndex)"></i>
						<a class="download-a" title='下载' v-if="fileItem.fileUrl" @click="downloadFile(fileItem)" :download="fileItem.fileName"><i class="el-icon-pt-xiazai"></i></a>
					</div>
					<div :class="normallist ? 'ifbp_file_icon_normal':'ifbp_file_icon_normal_list'" v-else>
						<span @click="updateFileName(fileItem,fileIndex)">确定</span>
						<span @click="handleUpdate(fileItem,fileIndex,'cancel')">取消</span>
					</div>

				</div>

			</div>
		</div>
		<!--<el-dialog v-model="dialogVisible" :closeOnClickModal=true custom-class='showImage' size="large">
			<div class='imgdiv' @mousewheel="bigimg" id = "omdiv">
				<img :id="pkMaterialFileIma" @drag="drag" :draggable='draggable'  @dragstart="dragstart" @dragend="dragend" v-if ="dialogVisible"   style='position: absolute;cursor: move;' :src="dialogImageUrl">
			</div>
			
			<div  class="dialog-footer" >
		
				
				<i class = "ifbp-icon-view el-icon-view"  @click='scoleL' title = "放大图片"></i>
				<span>{{Math.round(scole*100)}}%</span>
				<i class = "ifbp-icon-zoomout" @click='scoleS' title = "缩小图片"></i>
                <i class = "ifbp-icon-refresh el-icon-pt-shuaxin" @click='transR' title="向右旋转"></i>
			</div>
		</el-dialog>-->
		<el-dialog v-model="dialogVisible" :closeOnClickModal=true custom-class='showImage' size="full">
		<!--	<div class='imgdiv' id="omdiv" @mousewheel="bigimg" @mousedown="onmousedown">-->
			<div class='imgdiv'  id = "omdiv" @mousewheel="bigimg" @mousedown="onmousedown"  v-clickoutside:exactAreaClassName="handleClose">
				<div id="father_header" style="height:200px;position: absolute;top:0;left:0;width: 100%;">
					<div class="showImage_header" @click="handleClose">
						<i class="ifbp-icon-power-off el-icon-circle-close el-icon-circle-cross" style="font-size: 32px;"></i>

					</div>
				</div>
				<div class="exactAreaClassName" id="father_footer" style="height:200px;position: absolute;bottom:0;left:0;width: 100%;">
					<div class="dialog-footer">
						<i class="ifbp-icon-view el-icon-view" @click.stop='scoleL' title="放大图片"></i>
						<span>{{Math.round(scole*100)}}%</span>
						<i class="ifbp-icon-zoomout" @click.stop='scoleS' title="缩小图片"></i>
						<i style="margin-left: 12px;" class="ifbp-icon-refresh el-icon-pt-shuaxin" @click.stop='transR' title="向右旋转"></i>

					</div>
				</div>

				<img class="exactAreaClassName" :id="pkMaterialFileIma" v-if="dialogVisible" style='position: absolute;cursor: move;' :src="dialogImageUrl">
			</div>

		</el-dialog>

		<el-dialog v-model="dialogSign" title="全部标签" :closeOnClickModal=true size="small">

			<el-checkbox-group v-model="checkList">
				<el-checkbox label="纸质"></el-checkbox>
				<el-checkbox label="电子版"></el-checkbox>
			</el-checkbox-group>
			<div slot="footer" class="dialog-footer">
				<el-button @click='checkedSign'>确定</el-button>
				<el-button @click='cancelSign'>取消</el-button>

			</div>

		</el-dialog>
	</div>
</template>
<script>
	// import extend from "../../../src/utils/extend.js";
	import { getPinYinFirstCharacter } from './sort.js'
	import Clickoutside from 'ifbp-element/src/utils/clickoutside';
	export default {
		name: 'IfbpUpload',
		 directives: {
	        Clickoutside
	      },
		props: {
			fileClass: {
				type: String,
				default: ''
			},
			busiCode: {
				type: String,
				required: true,
			},
			pkBusi: {
				type: String,
				required: true,
			},
			busiType: {
				type: String,
				default: ''
			},
			pkBpm: {
				type: String,
				default: ''
			},
			forceType: {
				type: String,
				default: ''
			},
			disableDelete: {
				type: Boolean,
				default: false
			},
			disableUpload: {
				type: Boolean,
				default: false
			},
			unableUpload:{
				type: Boolean,
				default: false
			},
			disableUpdate: {
				type: Boolean,
				default: false
			},
			onSuccess: {
				type: Function,
				default: null
			},
			onChange: {
				type: Function,
				default: function() {

				}
			},
			itemWidth: {
				type: [Number, String],
				default: 128
			},
			itemHeight: {
				type: [Number, String],
				default: 128
			},
			pkBpmNode: {
				type: String,
				default: ''
			},
			groupCode: {
				type: String
			},
			materialCode: {
				type: String
			},
			nameCode: {
				type: String
			},
			isShowTitle: {
				type: Boolean,
				default: true
			},
			handleProgressUrl: {
				type: String
			}
		},
		data() {
			return {
				style1: {
					width: 200 + 'px',
					height: 100 + 'px'
				},
				groupList: [],
				realData: [],
				fileIcons: {
					ZIP: 'ifbp-icon-zip',
					PDF: 'ifbp-icon-pdf',
					TXT: 'ifbp-icon-txt',
					EXCEL: 'ifbp-icon-xls',
					PPT: 'ifbp-icon-ppt',
					WORD: 'ifbp-icon-doc',
					MUSIC: 'ifbp-icon-music',
					unKnown: 'ifbp-icon-unknown'
				},
				fileBColors: {
					ZIP: '#75787B',
					PDF: '#E60012',
					TXT: '#FFCC00',
					XLS: '#00A753',
					PPT: '#FF9500',
					WORD: '#0089FA',
					EXCEL: '#00A753',
					unKnown: '#75787B'
				},
				draggable: false,
				dialogVisible: false,
				dialogUpload: false,
				dialogSign: false,
				dialogImageUrl: '',
				pkMaterialFileIma: "",
				dialogImageDesc: '',
				action: '',
				normalFileListBase: [],
				type: '', // 附件类型：1.list 材料清单, 2.normal 普通附件 3. '' 不显示附件
				countRight: 0,
				scole: 1,
				showLeft: false,
				showRight: true,
				showCount: 0,
				normallist: false,
				showdrag: true,
				checkList: [],
				signObj: {},
				offsetX: 0,
				offsetY: 0,
				requestCancelQueue:[],//请求方法队列（调用取消上传)
				maxSize: 5 * 1024 * 1024 * 1024, // 上传最大文件限制
				multiUploadSize:  50 *1024 * 1024, // 大于这个大小的文件使用分块上传(后端可以支持断点续传)
				eachSize:  5 * 1024 * 1024, // 每块文件大小
			};
		},
		created() {
			this.init();
		},

		computed: {
			isNecessaryUpload: function() {
				var data = [];
				if(this.type !== 'normal') {
					if(!this.groupList || this.groupList.length == 0) {
						return data;
					}
					this.groupList.detailList.map((item, index) => {
						item.fileList.map(it => {
							if(it.isNecessary == '是' && (!this.groupList.fileMap[it.materialGroupCode + ',' + it.materialNameCode] || this.groupList.fileMap[it.materialGroupCode + ',' + it.materialNameCode].length == 0)) {
								data.push(item.materialGroupName + '-' + it.materialName);
							}
						})
					})
				}
				return data;
			}
		},
		watch: {
			pkBusi(val) {
				this.init();
			},
			busiCode(val) {
				this.init();
			},
			pkBpm(val) {
				this.init();
			},
			pkBpmNode(val) {
				this.init();
			},
			groupCode(val) {
				this.init();
			},
			materialCode(val) {
				this.init();
			},
			nameCode(val) {
				this.init();
			}
		},
		methods: {
			/* getBase64(url){

			        //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
			        var Img = new Image(),
			            dataURL='';
			        Img.setAttribute('crossOrigin', 'anonymous');
			        Img.src=url;
			        Img.onload=function(){ //要先确保图片完整获取到，这是个异步事件
			            var canvas = document.createElement("canvas"), //创建canvas元素
			                width=Img.width, //确保canvas的尺寸和图片一样
			                height=Img.height;
			            canvas.width=width;
			            canvas.height=height;
			            canvas.getContext("2d").drawImage(Img,0,0,width,height); //将图片绘制到canvas中
			            dataURL=canvas.toDataURL('image/jpeg'); //转换图片为dataURL
			            console.error(dataURL);
			        };
			    },
*/
			async checkFile(options) {

				const {
					maxSize,
					multiUploadSize,
					getSize,
					splitUpload,
					singleUpload
				} = this
				const {
					action,
					file,
					onProgress,
					onSuccess,
					onError
				} = options;
				if(file.size > maxSize) {
					return this.$message({
						message: `您选择的文件大于${getSize(maxSize)}`,
						type: 'error'
					})
				}
				try {
					if(file.size > multiUploadSize && this.type != "normal"){
						 splitUpload(file, onProgress,onSuccess).then(res=>{		
					 	     onSuccess();
						 })
					}else{
						onSuccess();
					}
				} catch(e) {
					
					console.error(e)
					this.$message({
						message: e.message,
						type: 'error'
					})
					onError()
				}
				const prom = new Promise((resolve, reject) => {})
				prom.abort = () => {}
				return prom;
			},
			getSize(size) {
				return size > 1024 ?
					size / 1024 > 1024 ?
					size / (1024 * 1024) > 1024 ?
					(size / (1024 * 1024 * 1024)).toFixed(2) + 'GB' :
					(size / (1024 * 1024)).toFixed(2) + 'MB' :
					(size / 1024).toFixed(2) + 'KB' :
					(size).toFixed(2) + 'B'
			},

			splitUpload(file, onProgress) {
				return new Promise(async(resolve, reject) => {
					try {
						const {
							eachSize
						} = this
						const chunks = Math.ceil(file.size / eachSize)
						const fileChunks = await this.splitFile(file, eachSize, chunks)
						let currentChunk = 0;
						let abc = {success:false};
						for(let i = 0; i < fileChunks.length; i++) {
							// 服务端检测已经上传到第currentChunk块了，那就直接跳到第currentChunk块，实现断点续传
						 
							if(Number(currentChunk) === i) {
								// 每块上传完后则返回需要提交的下一块的index
						         currentChunk++;
							 abc = await this.postFile({
									num: i,
									sum:chunks,
									key: file.uid,
									file: new File([fileChunks[i]],file.name) 
								}, onProgress)
								
							}
						}
						resolve(abc)
					} catch(e) {
						reject(e)
					}
				})
			},
			// 单文件直接上传
			singleUpload(file, onProgress) {
				return this.postFile({
					file,
					uid: file.uid,
					fileName: file.fileName
				}, onProgress)
			},
			// 文件分块,利用Array.prototype.slice方法
			splitFile(file, eachSize, chunks) {
				return new Promise((resolve, reject) => {
					try {
						
							const fileChunk = []
							for(let chunk = 0; chunks > 0; chunks--) {
								fileChunk.push(file.slice(chunk, chunk + eachSize))
								chunk += eachSize
							}
							resolve(fileChunk)
				
					} catch(e) {
						console.error(e)
						reject(new Error('文件切块发生错误'))
					}
				})
			},
			removeFile(file) {
				this.requestCancelQueue[file.uid]()
				delete this.requestCancelQueue[file.uid]
				return true
			},
			// 提交文件方法,将参数转换为FormData, 然后通过axios发起请求
			postFile(param, onProgress) {
				var data = {}				
				const formData = new FormData();
				for(let p in param) {
					formData.append(p, param[p])
				}
				const {
					requestCancelQueue
				} = this
			/*	const config = {
					cancelToken: new axios.CancelToken(function executor(cancel) {
						if(requestCancelQueue[param.key]) {
							requestCancelQueue[param.key]()
							delete requestCancelQueue[param.key]
						}
						requestCancelQueue[param.uid] = cancel;
					}),
					onUploadProgress: e => {
						if(param.sum) {
							e.percent = Number(((param.num + 1) / param.sum  * 100).toFixed(2));
						} else {
							e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
						}
						
						onProgress(e)
					}
				}*/
				return this.$http({
					url:"/ifbp-app-attach/attach/attachlargefile/uploadFile",
					method:"POST",
					data:formData,
					noLoading: true,
					onUploadProgress:e=>{
						
						if(param.sum) {
							e.percent = Number(((param.num + 1) / param.sum  * 100).toFixed(2));
						} else {
							e.percent = Number(((e.loaded / e.total) * 100).toFixed(2))
						}
						onProgress(e)
					}
				})
/*				return axios.post("/ifbp-app-attach/attach/attachlargefile/uploadFile", formData, config);*/
				/*axios.post("/ifbp-app-attach/attach/attachlargefile/uploadFile", formData, config).then(res =>res.data)*/
					/*(rs) =>{

				     
						if(param.sum - 1 == param.num && rs.data.success){
							 
							onSuccess();
						}
						
					} 
					
				)*/
				
				     
		/*		
				return axios.post("/ifbp-app-attach/attach/materialShow/materialUpload", formData, config).then(rs => rs.data)*/
			},
			// 文件校验方法
		/*	validateFile(file) {
				return axios.post('http://localhost:8888/validateFile', file).then(rs => rs.data)
			},
*/
			getOffset(o) {
				var left = 0,
					top = 0;
				while(o != null && o != document.body) {
					top += o.offsetTop;
					left += o.offsetLeft;
					o = o.offsetParent;
				}
				return {
					left: left,
					top: top
				};
			},
			scoleL() {
				this.bigimg(undefined, true);
			},
			scoleS() {
				this.bigimg(undefined, false);
			},
			bigimg(e, flag) {
				//以鼠标为中心缩放，同时进行位置调整
				var deltaY = 0,
					i = document.getElementById(this.pkMaterialFileIma),
					nh = parseInt(i.naturalHeight),
					nw = parseInt(i.naturalWidth),
					ch = document.body.clientHeight,
					cw = document.body.clientWidth,
					img = i.style,
					scaleSize = 1,
					bgX = isNaN(parseInt(img.left)) ? $(i)[0].offsetLeft : parseInt(img.left),
					bgY = isNaN(parseInt(img.top)) ? $(i)[0].offsetTop : parseInt(img.top),
					imgw = parseInt(img.width),
					imgh = parseInt(img.height),

					//获取图片的位置 如果图片的宽度或者高度超出了 浏览器的宽高
					flag1 = e && e.clientX > bgX && e.clientY > bgY && e.clientX < (bgX + imgw) && e.clientY < (bgY + imgh),
					x = flag1 ? e.clientX : (imgw > cw || imgh > ch) ? cw / 2 : (bgX + imgw / 2),
					y = flag1 ? e.clientY : (imgw > cw || imgh > ch) ? ch / 2 : (bgY + imgh / 2),
					$b = document.getElementById("omdiv");
				if(e) {
					e.preventDefault();
				}
				if(i) {
					var l = this.getOffset($b);
					x = x - l.left;
					y = y - l.top;
					var p = e ? (e.wheelDelta) / 1200 : (flag ? 0.2 : -0.17);
					var ns = scaleSize;
					ns += p;
					this.scole = ((imgw * ns) / nw).toFixed(2);
					ns = this.scole < 0.05 ? 1 : (this.scole > 5 ? 1 : ns); //可以缩小到0.1,放大到5倍
					//计算位置，以鼠标所在位置为中心
					//以每个点的x、y位置，计算其相对于图片的位置，再计算其相对放大后的图片的位置
					bgX = bgX - (x - bgX) * (ns - scaleSize) / (scaleSize);
					bgY = bgY - (y - bgY) * (ns - scaleSize) / (scaleSize);
					scaleSize = ns; //更新倍率 
					img.width = imgw * ns + "px";
					img.height = imgh * ns + "px";
					img.top = bgY + "px";
					img.left = bgX + "px";
				}

			},
			onmousedown(ev) {

				var box = document.getElementById(this.pkMaterialFileIma);
				var fa = document.getElementById('omdiv');

				let oEvent = ev;
				// 浏览器有一些图片的默认事件,这里要阻止
				oEvent.preventDefault();
				ev.preventDefault();
				var left = box.offsetLeft;
				var top = box.offsetTop;
				var disX = oEvent.clientX - box.offsetLeft;
				var disY = oEvent.clientY - box.offsetTop;
				fa.onmousemove = function(ev) {
					oEvent = ev;
					oEvent.preventDefault();
					var x = oEvent.clientX - disX;
					var y = oEvent.clientY - disY;
					if(x > 0) {
						x = 0
					} else if(x <= fa.offsetWidth - box.offsetWidth) {
						x = fa.offsetWidth - box.offsetWidth
					} else {
						x = x
					}
					if(y >= 0) {
						y = 0
					} else if(y <= fa.offsetHeight - box.offsetHeight) {
						y = fa.offsetHeight - box.offsetHeight
					} else {
						y = y
					}
					if(fa.offsetWidth >= box.offsetWidth) {
						x = left;
					}
					if(fa.offsetHeight >= box.offsetHeight) {
						y = top;
					}

					box.style.left = x + 'px';
					box.style.top = y + 'px';
				}
				// 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
				fa.onmouseleave = function() {
					fa.onmousemove = null;
					fa.onmouseup = null;
				}
				// 鼠标弹起后停止移动
				fa.onmouseup = function() {
					fa.onmousemove = null;
					fa.onmouseup = null;
				}
			},
			handleClose() {
				this.dialogVisible = false;
			},
			//获取浏览器的cookie
			getCookie(key) {
				var arr1 = document.cookie.split("; "); //由于cookie是通过一个分号+空格的形式串联起来的，所以这里需要先按分号空格截断,变成[name=Jack,pwd=123456,age=22]数组类型；
				for(var i = 0; i < arr1.length; i++) {
					var arr2 = arr1[i].split("="); //通过=截断，把name=Jack截断成[name,Jack]数组；
					if(arr2[0] == key) {
						return decodeURI(arr2[1]);
					}
				}
			},
			//获取文件的大小
			getSize(size) {
				var num = parseInt(size) ? parseInt(size) : 0;
				if(num < 1024) {
					num = num + 'B';
				} else if(num / 1024 <= 1024) {
					num = (num / 1024).toFixed(2) + 'K'
				} else {
					num = (num / (1024 * 1024)).toFixed(2) + 'M'
				}
				return num;
			},
			//将时间转化为 yyyy-MM-dd HH:mm
			formatDate(times) {
				var date = new Date(times);
				var o = {
					"M+": date.getMonth() + 1, //month
					"d+": date.getDate(), //day
					"h+": date.getHours(), //hour
					"m+": date.getMinutes(), //minute
					"s+": date.getSeconds(), //second
					"q+": Math.floor((date.getMonth() + 3) / 3), //quarter
					"S": date.getMilliseconds() //millisecond
				};
				var format = 'yyyy-MM-dd hh:mm';
				if(/(y+)/.test(format)) format = format.replace(RegExp.$1,
					(date.getFullYear() + "").substr(4 - RegExp.$1.length));
				for(var k in o)
					if(new RegExp("(" + k + ")").test(format))
						format = format.replace(RegExp.$1,
							RegExp.$1.length == 1 ? o[k] :
							("00" + o[k]).substr(("" + o[k]).length));
				return format;
			},
			// 下载附件
			downloadFile(fileItem) {
				var form = document.createElement("form");
				form.id = "ifbp-upload-download-form";
				form.name = "form";

				// 创建一个输入
				var input = document.createElement("input");
				// 设置相应参数
				input.type = "text";
				input.name = "url";
				input.value = fileItem.fileUrl;
				var input1 = document.createElement("input");
				// 设置相应参数
				input1.type = "text";
				input1.name = "fileName";
				//处理ie浏览器下中文名称的文件下载出现乱码的问题						
				var filename = encodeURI(fileItem.fileName);
				input1.value = filename;
				// 将该输入框插入到 form 中
				form.appendChild(input);
				form.appendChild(input1);
				// form 的提交方式
				form.method = "POST";
				// form 提交路径
				form.action = "/ifbp-app-attach/attach/materialShow/materialDownLoad";
				// 添加到 body 中
				document.body.appendChild(form);
				// 对该 form 执行提交
				form.submit();
				// 删除该 form
				document.body.removeChild(form);

				// 此方式点击之后可以下载，但是下载后的文件乱码。
				// this.$http({
				//     url: "/ifbp-app-attach/attach/materialShow/materialDownLoad",
				//     method: 'post',
				//     contentType: "application/x-www-form-urlencoded",
				//     data: "url=" + fileItem.fileUrl + "&fileName=" + fileItem.fileName,
				// }).then((res) => {
				//     var a = document.createElement('a');
				//     console.log(res.data);
				//     var blob = new Blob ([res.data]);
				//     var url = window.URL.createObjectURL(blob);
				//     var filename = fileItem.fileName;
				//     a.href = url;
				//     a.download = filename;
				//     a.click();
				//     window.URL.revokeObjectURL(url);
				// });
			},
			/**
			 * 按比例缩放图片
			 * */
			getImgMessage(file, mes) {

				var maxHeight = this.itemHeight;
				var maxWidth = this.itemWidth;
				this.$nextTick(function() {

					var image = null;
					if(mes === 'multi') {
						image = document.getElementById(file.pkMaterialFile + 'img')
					} else if(mes === 'check') {
						image = document.getElementById(this.pkMeterialFileIma);
					} else if(mes === 'all') {
						image = document.getElementById(file.pkMaterialFile + 'imag')

					} else {
						image = document.getElementById(file.pkMaterialFile)
					}

					if(image) {
						if(mes === 'multi') {
							maxHeight = maxHeight * 2;
							maxWidth = maxWidth * 2;
						}

						image.onload = function(e) {

							var naturalHeight = e.target.naturalHeight;
							var naturalWidth = e.target.naturalWidth;
							var nh = parseFloat(naturalHeight / maxHeight);
							var nw = parseFloat(naturalWidth / maxWidth);
							if(nh > nw) {
								image.style.height = maxHeight + 'px';
								image.style.width = nh > 1 ? parseFloat(naturalWidth / nh) + 'px' : parseFloat(naturalWidth / nh) + 'px';
								image.style.marginTop = 0;
							} else {
								image.style.width = maxWidth + 'px';
								image.style.height = nw > 1 ? parseFloat(naturalHeight / nw) + 'px' : parseFloat(naturalHeight / nw) + 'px';
								image.style.marginTop = nw > 1 ? parseFloat(parseFloat((maxHeight - naturalHeight / nw)) / 2) + 'px' : parseFloat(parseFloat((maxHeight - naturalHeight / nw)) / 2) + 'px';
							}
							var canvas = document.createElement("canvas"); //创建canvas元素
							var width = image.width;
							var height = image.height;
							canvas.width = width;
							canvas.height = height;
							canvas.getContext("2d").drawImage(image, 0, 0, width, height); //将图片绘制到canvas中
							image.src = canvas.toDataURL('image/jpeg');
						}
					}
				})
			},

			// 删除附件
			handleRemove(map, materialNameCode, inx, mes) {

				let isNormal = this.type === "normal";
				inx = inx ? inx : 0;
				var file = null;
				if(mes) {
					file = map[materialNameCode][inx]
				} else {
					file = isNormal ? map : this.getFile(map, materialNameCode);
				}
				var url = encodeURI('/ifbp-app-attach/attach/materialShow/deteleByPkMaterialFile?pkMaterialFile=' + file.pkMaterialFile)
				this.$confirm('是否删除当前文件?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$http({
						url: url,
						method: 'get',
					}).then((res) => {
						if(res.data.success === true) {
							this.$message({
								type: 'success',
								message: '删除成功！'
							});
							if(isNormal) {
								let index = materialNameCode;
								this.normalFileListBase.splice(index, 1);
							} else {

								var index = inx ? inx : 0;

								map[materialNameCode].splice(index, 1);
							}
							this.$emit("handleRemove", file);
							this.$forceUpdate();
						} else {
							this.$message('删除失败');
						}
					}).catch(e => {
						this.$message({
							type: 'error',
							message: e
						});
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			removeFile() {

			},
			//双击图片预览
			//跟据图片的原始比例  和弹出层的大小 来 缩放图片 
			handlePreview(map, materialNameCode, inx) {
				let file;
				if(this.type === "normal") {
					file = map;
				} else if(inx !== null && inx !== undefined && inx !== "") {
					file = this.groupList.fileMap[materialNameCode][inx];
				} else {
					file = this.getFile(map, materialNameCode);
				}
				this.dialogImageUrl = file ? file.previewUrl : '';
				this.pkMaterialFileIma = file ? file.pkMaterialFile + "images" : '';
				this.dialogVisible = true;
				var _this = this;

				this.$nextTick(function() {

					var drag = document.getElementById(this.pkMaterialFileIma)
					var clientWidth = document.body.clientWidth;
					var clientHeight = document.body.clientHeight;
					document.getElementById("omdiv").style.height = (clientHeight - 64) + "px";
					drag.onload = function(e) {
						var width = e.target.naturalWidth;
						var height = e.target.naturalHeight;
						if(width >= clientWidth && height >= clientHeight) {
							var bili1 = getWidthOrHeight(width, clientWidth, width);
							var bili2 = getWidthOrHeight(height, clientHeight, height);
							var bili = bili1 > bili2 ? bili2 : bili1;
							_this.scole = bili;
							_this.draggable = true;
						} else if(width < clientWidth && height > clientHeight) {
							var bili = getWidthOrHeight(height, clientHeight, height);
							_this.scole = bili;
						} else if(width > clientWidth && height < clientHeight) {
							var bili = getWidthOrHeight(width, clientWidth, width);
							_this.scole = bili;
						} else {
							_this.scole = 1;
						}
						drag.style.height = height * _this.scole + 'px';
						drag.style.width = width * _this.scole + 'px';
						drag.style.height > clientHeight || drag.style.width > clientWidth ? this.draggable = true : _this.draggable = false;
						drag.style.transform = ' rotate(' + this.countRight * 90 + 'deg)'

						function getWidthOrHeight(mete, normal, mete2) {
							if(mete < normal) {
								return(mete / mete2).toFixed(2)
							} else {
								return getWidthOrHeight(mete / 1.2, normal, mete2)
							}
						}
					}
				})
			},
			getFile(map, materialNameCode) {
				let fileObj = {};
				let fileArr = map ? map[materialNameCode] : [];
				if(Object.prototype.toString.call(fileArr) === "[object Array]" && fileArr.length) {
					let lastFile = fileArr[fileArr.length - 1];
					fileObj = Object.assign({}, lastFile);
					fileObj.previewUrl = this.getPreviewUrl(lastFile, 'url');
					fileObj.previewColor = this.getPreviewUrl(lastFile, 'color');
					fileObj.preViewBK = this.getPreviewUrl(lastFile, 'bk');
				}
				return fileObj;
			},
			/*			getFileList(map, materialNameCode) {
							let fileArr = map ? map[materialNameCode] : [];
							fileArr.map((item, index) => {
								item.previewUrl = this.getPreviewUrl(item);
							})
							return fileArr;
						},*/
			updateFileList(map, materialNameCode, fileIndex, mes) {
				this.groupList.fileMap[materialNameCode][fileIndex].editable = mes === "update" ? true : false;
				this.groupList.fileMap[materialNameCode] = Object.assign([], this.groupList.fileMap[materialNameCode]);
				if(mes === 'update') {
					var _id = this.groupList.fileMap[materialNameCode][fileIndex].pkMaterialFile + "textarea";
					this.$nextTick(function() {
						var oTextarea = document.getElementById(_id);
						this.funGetSelected(oTextarea);
						this.funInsertTopic(oTextarea);
					})
				}
			},
			getFileType(fileItem) {
				var type = "";
				if(fileItem.fileType) {
					type = fileItem.fileType;
				} else {
					var inx = fileItem.fileName.lastIndexOf(".") + 1;
					var len = fileItem.fileName.length;
					type = fileItem.fileName.substring(inx, len).toUpperCase();
					if(type === 'TEXT') {
						type = 'TXT';
					} else if(type === 'DOC' || type == 'DOCX') {
						type = 'WORD';
					} else if(type === "RAR" || type === "7Z" || type === "ZIP" || type === "GZ") {
						type = 'ZIP';
					} else if(type === "XLS" || type === "XLSX") {
						type = 'EXCEL'
					} else if(type === "PPTX" || type === "PPT") {
						type = "PPT"
					}
				}
				return type;
			},

			getPreviewUrl(fileItem, code) {
				var previewUrl = "";
				//如果后台没有返回对应的文档类型 
				var type = this.getFileType(fileItem);
				switch(type) {
					case 'IMAGE':
						//encodeURI 使用encodeURI 对url进行编码 避免ie浏览器出现问题 
						previewUrl = encodeURI('/ifbp-app-attach/attach/materialShow/materialDownLoad?url=' + fileItem.fileUrl + '&fileName=' + fileItem.fileName);
						break;
					case 'ZIP':
					case 'PDF':
					case 'WORD':
					case 'TXT':
					case 'PPT':
					case 'EXCEL':
						if(code == 'color') {
							previewUrl = 'white';
						} else if(code == 'bk') {
							previewUrl = this.fileBColors[type];
						} else {
							previewUrl = this.fileIcons[type];
						}
						break;
					default:
						if(code == 'color') {
							previewUrl = 'white';
						} else if(code == 'bk') {
							previewUrl = this.fileBColors['unKnown'];
						} else {
							previewUrl = this.fileIcons['unKnown'];
						}
						break;
				}
				return previewUrl;
			},
			init() {
				const callback = () => {

					if(this.type) {
						const isNormal = this.type === "normal";
						let url;
						let params;
						if(isNormal && !this.pkBpmNode) {
							url = "/ifbp-app-attach/attach/materialShow/findCommonAttachList";
							params = {
								pk_busi: this.pkBusi // pk_busi 注意"_"
							}
						} else if(!isNormal && !this.pkBpmNode) {
							url = "/ifbp-app-attach/attach/materialShow/findAllBpmMaterialList"; //材料清单
							params = {
								pkBusi: this.pkBusi,
								busiCode: this.busiCode,
								pkBpm: this.pkBpm
							};
							if(this.groupCode) {
								params['groupCode'] = this.groupCode;
							}
							if(this.materialCode) {
								params['material_code'] = this.materialCode;
							}
							if(this.nameCode) {
								params['nameCode'] = this.nameCode;
							}
						} else {
							url = "/ifbp-app-attach/attach/materialShow/findAllBpmMaterialListV2" //流程清单
							params = {
								pkBusi: this.pkBusi,
								busiCode: this.busiCode,
								pkBpmNode: this.pkBpmNode
							};
						}
						this.$http({
							url: url,
							method: 'GET',
							content: 'application/json',
							params: params,
						}).then(res2 => {
							this.realData = [];
							if(isNormal && !this.pkBpmNode) {
								this.action = "/ifbp-app-attach/attach/materialShow/commonAttachUpload";
								this.realData.push({
									pkBusi: this.pkBusi
								});
								if(JSON.stringify(res2.data.data) != "{}") {
									this.normalFileListBase = res2.data.data
									this.normalFileListBase.map((item, index) => {
										item.editable = false;
										item.previewUrl = this.getPreviewUrl(item, 'url');
										item.previewBK = this.getPreviewUrl(item, 'bk');
									})
								}
								this.normalFileListBase.sort(this.compare);

							} else {
								this.groupList = res2.data.data;
								this.action = "/ifbp-app-attach/attach/materialShow/materialUpload";
								var detailList = this.groupList.detailList || [];
								if(detailList) {
									for(let i = 0; i < detailList.length; i++) {
										let fileList = [];
										for(let j = 0; j < detailList[i].fileList.length; j++) {
											const element = detailList[i].fileList[j];
											if(element) {
												element.editable = false;
												element.dialogUpload = false;
												fileList.push({
													pkBusi: this.pkBusi,
													pkMaterialDetail: element.pkMaterialDetail,
													pkMaterialRecord: element.pkMaterialRecord,
													materialGroupCode: element.materialGroupCode,
													materialGroupName: element.materialGroupName,
													materialNameCode: element.materialNameCode,
													materialName: element.materialName
												});
											}
										}
										this.realData.push(fileList);
									}
								}
								var fileMap = this.groupList.fileMap;
								for(var key in fileMap) {
									let arr = fileMap[key] ? fileMap[key] : [];
									arr.map((item, index) => {
										item.previewUrl = this.getPreviewUrl(item, 'url');
										item.preViewBK = this.getPreviewUrl(item, 'bk');

										item.editable = false;
									})
									arr.sort(this.compare); //排序								
								}
							}
						});
					}
				};

				if(this.forceType) {
					this.type = this.forceType;
					callback();
				} else {
					this.$http({
						url: '/ifbp-app-attach/attach/attachattachmentstate/findByBusiCode?busiCode=' + this.busiCode + "&busiName=",
						method: 'get',
					}).then(res1 => {
						let typeObj = res1.data.data;

						if(typeObj) {
							if(typeObj.isEnableAttachment === "true") {
								if(typeObj.isEnableMaterialList === "true") { // 材料清单
									this.type = "list";
								} else {
									this.type = "normal"; // 普通附件
								}
							} else {
								this.type = ""; // 未开启附件功能
							}
						}
						callback();
					});
				}
			},
			handleProgress(event, file, fileList, mes, groupindex, fileindex) {
				if(mes === 'normal') {
					this.normalFileListBase[this.normalFileListBase.length - 1].percent = event.percent;
					this.normalFileListBase = Object.assign([], this.normalFileListBase);
					if(event.percent == 100) {
						file.percent = "后台处理中..."
						//轮询查询 后台处理进度
						if(this.handleProgressUrl) {
							var _this = this;
							var handleService = setInterval(function() {
								_this.$http({
									url: _this.handleProgressUrl + '?pkMaterialFile=' + _this.normalFileListBase[_this.normalFileListBase.length - 1].pkMaterialFile,
									method: 'get',
								}).then(res => {
									_this.normalFileListBase[_this.normalFileListBase.length - 1].percent = "后台处理" + res.data.percent + "%";
									_this.normalFileListBase = Object.assign([], _this.normalFileListBase);
									if(res.data.percent == 100) {
										clearInterval(handleService);
									}
								})

							}, 500);
						}
					}
				} else {
					var groupcode = this.groupList.detailList[groupindex].fileList[fileindex].materialGroupCode;
					var namecode = this.groupList.detailList[groupindex].fileList[fileindex].materialNameCode;
					var code = groupcode + "," + namecode;
					if(event.percent == 100) {
						file.percent = 99;
					} else {
						file.percent = event.percent;
					}
					var inx = this.groupList.fileMap[code].length - 1;
					if(inx > -1){

						this.groupList.fileMap[code][inx].percent = event.percent;
					}
				    var obj = JSON.parse(JSON.stringify(this.groupList.fileMap[code][inx]))
					this.groupList.fileMap[code].splice(inx,1,obj);
					this.groupList.fileMap[code] = Object.assign([], this.groupList.fileMap[code]);					
				}
			},
			handleSuccess(res, file, fileList, map, fileItem, type, groupIndex, fileIndex) {
				const formData = new FormData();
				var formMess = this.type === "normal" ? this.realData[0] : this.realData[groupIndex][fileIndex];
				for(let p in formMess) {
					formData.append(p, formMess[p])
				}
				var url = this.action;
				if(file.size > this.multiUploadSize && this.type !== "normal"){
					url = "/ifbp-app-attach/attach/materialShow/materialUploadForLage";
					formData.append("fileName",file.name);
					formData.append("fileKey", file.uid);
				}else{
					formData.append("file", file.raw ? file.raw : file);
				}
				
				this.$http({
					url: url,
					method: 'post',
					noLoading: true,
					contentType: 'application/x-www-form-urlencoded',
					data: formData
				}).then(res => {
					file.percent = 100;
					if(res.data.success == false) {
						this.$message({
							type: "error",
							message: "文件上传失败"
						})
						//当文件上传失败时手工删除 添加的数据
						if(this.type === "normal") {
							this.normalFileListBase.map((item, inx) => {
								if(item.uid && item.uid === file.uid) {
									this.normalFileListBase.splice(inx, 1)
								}
							})
							this.normalFileListBase = Object.assign([], this.normalFileListBase);
						} else if(type !== 'multi') {
							const materialGroupCode = fileItem.materialGroupCode;
							const materialNameCode = fileItem.materialNameCode;
							map[materialGroupCode + ',' + materialNameCode] = [];
							this.$forceUpdate();
						} else {
							var code = fileItem.materialGroupCode + ',' + fileItem.materialNameCode;
							this.groupList.fileMap[code].map((item, inx) => {
								if(item.uid && item.uid === file.uid) {
									this.groupList.fileMap[code].splice(inx, 1)
								}
							})
							this.groupList.fileMap[code] = Object.assign([], this.groupList.fileMap[code]);
							this.$forceUpdate();
						}
						return;
					} else {
						var data = res.data.data;

						var currentFileArr = [];
						if(this.type === "normal") {
							currentFileArr = data;
							currentFileArr.map((item, index) => {
								item.editable = false;
								item.previewUrl = this.getPreviewUrl(item, 'url');
								item.previewBK = this.getPreviewUrl(item, 'bk');
							})

							this.normalFileListBase.map((item, inx) => {
								if(item.uid && item.uid === file.uid && file.percent == 100) {
									this.normalFileListBase[inx] = currentFileArr[0];
								}
							})
							this.normalFileListBase = Object.assign([], this.normalFileListBase);
							this.normalFileListBase.sort(this.compare); //排序数组

						} else if(type !== 'multi') { //单文件
							const materialGroupCode = fileItem.materialGroupCode;
							const materialNameCode = fileItem.materialNameCode;
							if(data && data.map) {
								currentFileArr = data.map[materialNameCode];
								let fileArr = Object.prototype.toString.call(fileArr) === "[object Array]" ?
									map[materialGroupCode + ',' + materialNameCode] : [];
								map[materialGroupCode + ',' + materialNameCode] = [];
								map[materialGroupCode + ',' + materialNameCode] = [...fileArr, ...currentFileArr];
								this.$forceUpdate(); // 强制当前vue视图重新渲染,从新调用getFile方法更新图片预览
							}
						} else {
							var code = fileItem.materialGroupCode + ',' + fileItem.materialNameCode;
							if(data && data.map) {
								currentFileArr = data.map[fileItem.materialNameCode] ? data.map[fileItem.materialNameCode] : [];
								currentFileArr.map((item, index) => {
									item.editable = false;
									item.previewUrl = this.getPreviewUrl(item);
									item.preViewBK = this.getPreviewUrl(item, 'bk');
								})
								this.groupList.fileMap[code].map((item, inx) => {
									if(item.uid && item.uid === file.uid && file.percent == 100) {
										this.groupList.fileMap[code][inx] = currentFileArr[0];
									}
								})
								this.groupList.fileMap[code] = Object.assign([], this.groupList.fileMap[code]);
								this.groupList.fileMap[code].sort(this.compare);

								this.$forceUpdate(); // 强制当前vue视图重新渲染,从新调用getFile方法更新图片预览
							}
						}
						typeof this.onSuccess === 'function' && this.onSuccess(res, file, fileList);
					}

				}).catch(e => {
					this.$message({
						type: 'error',
						message: '文件名修改失败!'
					})
				});
			},
			onError(err, file, fileList, map, fileItem, type) {
			
				//上传失败				
				this.$message({
					type: "error",
					message: "上传失败!"
				})
				//当文件上传失败时手工删除 添加的数据
				if(this.type === "normal") {
					this.normalFileListBase.map((item, inx) => {
						if(item.uid && item.uid === file.uid) {
							this.normalFileListBase.splice(inx, 1)
						}
					})
					this.normalFileListBase = Object.assign([], this.normalFileListBase);
				} else if(type !== 'multi') {
					const materialGroupCode = fileItem.materialGroupCode;
					const materialNameCode = fileItem.materialNameCode;
					map[materialGroupCode + ',' + materialNameCode] = [];
					this.$forceUpdate();
				} else {
					var code = fileItem.materialGroupCode + ',' + fileItem.materialNameCode;
					this.groupList.fileMap[code].map((item, inx) => {
						if(item.uid && item.uid === file.uid) {
							this.groupList.fileMap[code].splice(inx, 1)
						}
					})
					this.groupList.fileMap[code] = Object.assign([], this.groupList.fileMap[code]);
					this.$forceUpdate();
				}
				console.log(err, file, fileList);
			},
			beforeUpload(file, groupIndex, fileIndex, type) {
				//上传时将文件的size内存大小传到后台  
			
				if(type == 'normal') {
					this.realData[0].size = file.size;
					this.realData[0].busitype = this.busiType;
					this.realData[0].creator = this.getCookie('_A_P_loginName') ? this.getCookie('_A_P_loginName') : '';
					//加入进度条 文件未上传时
					file.percent = 0;
					file.uploading = true;
					file.fileName = file.name;

					this.normalFileListBase.push(file);

				} else {

					this.realData[groupIndex][fileIndex].size = file.size;
					this.realData[groupIndex][fileIndex].busitype = this.busiType;
					this.realData[groupIndex][fileIndex].busiCode = this.busiCode;
					this.realData[groupIndex][fileIndex].creator = this.getCookie('_A_P_loginName') ? this.getCookie('_A_P_loginName') : '';
					file.percent = 0;
					file.uploading = true;
					file.fileName = file.name;
					var groupcode = this.groupList.detailList[groupIndex].fileList[fileIndex].materialGroupCode;
					var namecode = this.groupList.detailList[groupIndex].fileList[fileIndex].materialNameCode;
					var code = groupcode + "," + namecode;
					if(this.groupList.fileMap[code]) {
						this.groupList.fileMap[code].push(JSON.parse(JSON.stringify(file)))

					} else {
						this.groupList.fileMap[code] = new Array();
						this.groupList.fileMap[code].push(JSON.parse(JSON.stringify(file)))					
					 /*   this.groupList.fileMap[code] = Object.assign({},  this.groupList.fileMap[code])*/
					}
					this.groupList = Object.assign({}, this.groupList)
				
				}
			},
			transR() {
				this.countRight += 1;
				document.getElementById(this.pkMaterialFileIma).style.transform = 'rotate(' + this.countRight * 90 + 'deg)'
			},
			transL() {
				this.countRight -= 1;
				document.getElementById(this.pkMaterialFileIma).style.transform = 'rotate(' + this.countRight * 90 + 'deg)'
			},
			//			仿照 QQ图片预览 放大缩小 在原图片的基础上*1.2 或/1.2

			//编辑文件名称
			handleUpdate(file, fileIndex, mes) {
				this.normalFileListBase[fileIndex].editable = mes == "update" ? true : false;
				this.normalFileListBase = Object.assign([], this.normalFileListBase);
				let _id = this.normalFileListBase[fileIndex].pkMaterialFile + "textarea";
				this.$nextTick(function() {
					var oTextarea = document.getElementById(_id);
					this.funGetSelected(oTextarea);
					this.funInsertTopic(oTextarea);
				})

			},
			handleUpdateList(map, groupIndex, fileIndex, mes) {
				this.groupList.detailList[groupIndex].fileList[fileIndex].editable = mes === "update" ? true : false;
				this.groupList.detailList[groupIndex].fileList = Object.assign([], this.groupList.detailList[groupIndex].fileList);
				let _id = this.groupList.detailList[groupIndex].fileList[fileIndex].pkMaterialDetail + "textarea";
				this.$nextTick(function() {
					var oTextarea = document.getElementById(_id);
					this.funGetSelected(oTextarea);
					this.funInsertTopic(oTextarea);
				})
			},
			funGetSelected(element) {
				if(!window.getSelection) {
					//IE浏览器
					return document.selection.createRange().text;
				} else {
					return element.value.substr(element.selectionStart, element.selectionEnd - element.selectionStart);
				}
			},
			funInsertTopic(textObj) {
				var value = textObj.value;
				var prefix_name = value.split(".")[0];
				var postfix_name = value.split(".")[1];
				var index = value.indexOf(prefix_name);
				textObj.setSelectionRange(index, index + prefix_name.length);
				textObj.focus();
			},
			/**
			 * 普通附件修改文件名
			 * */
			updateFileName(file, index) {
				let data = Object.assign({}, file);
				delete data.editable;
				delete data.previewUrl;
				delete data.previewBK;
				delete data.status;
				delete data.uid;
				let _id = this.normalFileListBase[index].pkMaterialFile + 'textarea';
				var filename = document.getElementById(_id).value;
				data.fileName = filename;
				this.updateName(data);
			},
			/**
			 * 多文件弹框文件名的修改
			 * */
			updateListFileName(file, groupIndex, fileIndex, code) {
				let data = Object.assign({}, file);
				this.getCorrectData(data, groupIndex, fileIndex, code, 'mulity')
			},
			updateFileNameMulity(map, code, groupIndex, fileIndex) {
				let fileArr = map ? map[code] : [];
				let lastFile = fileArr[fileArr.length - 1];
				let data = Object.assign({}, lastFile);
				this.getCorrectData(data, groupIndex, fileIndex, code)
			},
			getCorrectData(data, groupIndex, fileIndex, code, mes) {
				delete data.pkMaterialRecord;
				delete data.dialogUpload;
				delete data.editable;
				delete data.isNecessary;
				delete data.isUploadCopies;
				delete data.remark;
				delete data.ts;
				delete data.previewUrl;
				delete data.preViewBK;
				var ts = new Date()
				data.ts = ts.getTime();
				data.creator = this.getCookie('_A_P_loginName') ? this.getCookie('_A_P_loginName') : data.creator;
				var _id = mes === 'mulity' ? this.groupList.fileMap[code][fileIndex].pkMaterialFile + 'textarea' : this.groupList.detailList[groupIndex].fileList[fileIndex].pkMaterialDetail + 'textarea'
				var filename = document.getElementById(_id).value;
				data.fileName = filename;
				this.updateName(data);
			},
			updateName(param) {
				this.$http({
					url: "/ifbp-app-attach/attach/attachmaterialfile/update",
					method: 'post',
					data: param
				}).then(res => {
					if(res.data.success) {
						this.$message({
							type: 'success',
							message: "修改成功!"
						})
						this.init();
					}
				}).catch(e => {
					this.$message({
						type: 'error',
						message: '文件名修改失败!'
					})
				});
			},
			uploadMulti(fileItem, groupIndex, fileIndex, mes) {

				/*				if(this.disableUpload){
									return 
								}*/
				this.groupList.detailList[groupIndex].fileList[fileIndex].dialogUpload = mes === "open" ? true : false;

				this.groupList.detailList[groupIndex].fileList = Object.assign([], this.groupList.detailList[groupIndex].fileList);
				var code = fileItem.materialGroupCode + ',' + fileItem.materialNameCode;
				var arr = this.groupList.fileMap[code];
				if(!arr) return;
				arr.map((item) => {
					if(item.fileType === "IMAGE") {
						this.$nextTick(function() {
							var maxHeight = this.itemHeight * 2;
							var maxWidth = this.itemWidth * 2;
							var image = document.getElementById(item.pkMaterialFile + 'img')
							image.onload = function(e) {
								var naturalHeight = e.target.naturalHeight;
								var naturalWidth = e.target.naturalWidth;
								var nh = parseFloat(naturalHeight / maxHeight);
								var nw = parseFloat(naturalWidth / maxWidth);
								if(nh > nw) {
									image.style.height = maxHeight + 'px';
									image.style.width = nh > 1 ? parseFloat(naturalWidth / nh) + 'px' : parseFloat(naturalWidth * nh) + 'px';
								} else {
									image.style.width = maxWidth + 'px';
									image.style.height = nw > 1 ? parseFloat(naturalHeight / nw) + 'px' : parseFloat(naturalHeight * nw) + 'px';
									image.style.marginTop = nw > 1 ? parseFloat(parseFloat((maxHeight - naturalHeight / nw)) / 2) + 'px' : parseFloat(parseFloat((maxHeight - naturalHeight * nw)) / 2) + 'px';
								}
							}
						})
					}
				})
			},
			closeDialog($event, groupIndex, fileIndex) {
				if(!$event) {
					this.groupList.detailList[groupIndex].fileList[fileIndex].dialogUpload = false;
					this.showCount = 0;
					this.groupList.detailList[groupIndex].fileList = Object.assign([], this.groupList.detailList[groupIndex].fileList);
					var _id = "transx" + fileIndex;
					document.getElementById(_id).style.transform = 'translateX(0)';
				}
			},
			goleft(index) {
				/**
				 * showCount 初始为0
				 * 左移一 showCount+1 
				 * 右移一 showCount-1 
				 * */
				if(this.showCount <= 0) {
					this.showCount++;
				}
				var log = this.itemWidth * this.showCount * 2;
				document.getElementById('transx' + index).style.transform = 'translateX(' + log + 'px)';
			},
			goright(index) {
				this.showCount--;
				var log = this.itemWidth * this.showCount * 2;
				document.getElementById('transx' + index).style.transform = 'translateX(' + log + 'px)';
			},
			getLeftShow() {
				return this.showCount < 0;
			},
			getRightShow(list) {
				if(list) {
					let length = list.length;
					return this.showCount + length - 3 >= 0;
				}
				return false;
			},
			/**
			 * 批量删除
			 * */
			deleteAll(code) {

				let isNormal = this.type === "normal";
				this.$confirm('是否删除当前上传文件?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var promises = [];
					this.groupList.fileMap[code].map(item => {
						var url = encodeURI('/ifbp-app-attach/attach/materialShow/deteleByPkMaterialFile?pkMaterialFile=' + item.pkMaterialFile);
						promises.push(
							this.$http({
								url: url,
								method: 'get',
							})
						)
					})
					this.$http.all(promises).then(this.$http.spread((...reses) => {
						var count = 0;
						reses.map(res => {
							if(res.data.success == true) {
								count++;
							}
						})
						if(count == reses.length) {
							delete this.groupList.fileMap[code];
							this.$forceUpdate();
							this.$message("删除成功!");
						} else {
							this.$message({
								type: "error",
								message: "删除失败!"
							});
						}
					})).catch(e => {
						this.$message({
							type: 'info',
							message: '删除失败'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			download(name, href) {
				var a = document.createElement("a"), //创建a标签
					e = document.createEvent("MouseEvents"); //创建鼠标事件对象
				e.initEvent("click", false, false); //初始化事件对象
				a.href = "/ifbp-app-attach/attach/materialShow/materialDownLoad?url=" + href + '&fileName=' + name; //设置下载地址
				a.download = name; //设置下载文件名
				a.dispatchEvent(e); //给指定的元素，执行事件click事件
			},
			/**
			 * 批量下载
			 * */
			downloadAll(code) {
				//获取所有的下载地址
				this.groupList.fileMap[code].map(item => {
					this.download(item.fileName, item.fileUrl);
				})
			},
			showUploadDrag() {
				document.getElementsByClassName('upload-demo')[0].style.display = this.showdrag ? 'none' : 'block';
				document.getElementsByClassName('normal-filebody')[0].style.marginBottom = this.showdrag ? 0 : 16 + 'px';
				document.getElementsByClassName('normal-filebody')[0].style.height = this.showdrag ? 0 : 200 + 'px';
				this.showdrag = !this.showdrag
			},
			swithShowList(mes) {
				mes === 'list' ? this.normallist = true : this.normallist = false;
			},
			signUpload(map, code, inx) {
				//获取
				inx = inx ? inx : 0;
				this.checkList = map[code][inx].checkedSign ? map[code][inx].checkedSign : [];
				this.dialogSign = true;
				let isNormal = this.type === "normal";
				let file = isNormal ? map : this.getFile(map, code);
				this.signObj['type'] = 'mulity';
				this.signObj['index'] = inx ? inx : 0;
				this.signObj['map'] = map;
				this.signObj['code'] = code;

			},
			checkedSign() {
				this.dialogSign = false;
				var map = this.signObj['map'];
				var index = this.signObj['index']
				var code = this.signObj['code'];

				this.groupList.fileMap[code][index].checkedSign = this.checkList;
				this.groupList.fileMap[code] = Object.assign([], this.groupList.fileMap[code]);
				//将标记 和数据绑定 存到数据库 

			},
			cancelSign() {
				this.dialogSign = false;
				this.checkList = []
			},
			handleVisibility(file) {
				if(file.fileUrl.indexOf(".html") > -1) {
					var isSuccess = false;
					var html = ""
					$.ajax({
						type: 'POST',
						url: "/ifbp-app-attach/attach/materialShow/materialDownLoad",
						contentType: 'application/x-www-form-urlencoded',
						data: "url=" + file.fileUrl + "&fileName=" + file.fileName,
						async: false,
						success: function success(res) {
							isSuccess = true;
							html = res;
						}
					});
					if(isSuccess) {
						var dw;
						dw = window.open('', file.fileUrl) || window.parent.open();
						dw.document.open();
						dw.document.write(html);
						dw.document.close();
					}
				} else {
					var url = '/api/oss/pdfViewer/pdfViewer.html?id=' + file.fileUrl;
					window.open(url);
				}
			},
			/**
			 *首字符为数字，排序规则l:0-9;
			 *首字符为字母，排序规则A-Z；
			 *首字符为汉字，排序规则以汉字拼音首字母顺序排序A-Z;
			 *首字符一致，则以第二字符为维度，以此类推 
			 */

			compare(obj1, obj2) { //比较函数
				//转化为字符串
				var x = obj1.fileName ? obj1.fileName : obj1;
				var y = obj2.fileName ? obj2.fileName : obj2;
				var a = x + "";
				var b = y + "";
				var length_a = a.length;
				var length_b = b.length;
				if(length_a > 0 && length_b > 0) {
					var char_a = a.substring(0, 1).toUpperCase();
					var char_b = b.substring(0, 1).toUpperCase();
					//判断类型 
					var type_a = this.getCharType(char_a).type; //判断是不是数字
					var type_b = this.getCharType(char_b).type;
					var val_a = this.getCharType(char_a).val;
					var val_b = this.getCharType(char_b).val;
					if(type_a == type_b && type_a == "number" || type_a == "string") {
						if(char_a > char_b) {
							return 1;
						} else if(char_a < char_b) {
							return -1;
						} else {
							if(length_a == 1 && length_b != 1) {
								return -1;
							} else if(length_b == 1 && length_a != 1) {
								return 1;
							} else if(length_a == 1 && length_b == 1) {
								return 0;
							} else {
								return this.compare(a.substring(1, length_a), b.substring(1, length_b));
								//递归调用该方法
							}
						}
					} else if(type_a == type_b && type_a == "chinese") {
						var xx = this.getChar(char_a);
						var yy = this.getChar(char_b);
						if(xx > yy) {
							return 1;
						} else if(xx < yy) {
							return -1;
						} else {
							if(length_a == 1 && length_b != 1) {
								return -1;
							} else if(length_b == 1 && length_a != 1) {
								return 1;
							} else if(length_a == 1 && length_b == 1) {
								return 0;
							} else {
								return this.compare(a.substring(1, length_a), b.substring(1, length_b));
								//递归调用该方法
							}
						}
					} else if(type_a != type_b) {
						if(val_a > val_b) {
							return 1;
						} else {
							return -1;
						}
					}
				}

			},

			// 判断字符的类型 
			getCharType(x) {
				var obj = {
					type: "",
					val: 0
				}

				if(isFinite(x)) {
					obj.type = "number";
					obj.val = 0;
				} else if(this.isChinese(x)) {
					obj.type = "chinese";
					obj.val = 2;
				} else {
					obj.type = "string";
					obj.val = 1;
				}
				return obj;
			},
			//判断字符是不是中文
			isChinese(temp) {
				var re = /[\u4e00-\u9fa5]/;
				if(!re.test(temp)) return false;
				return true;
			},

			getChar(param) {
				return getPinYinFirstCharacter(param);
			}
			//返回汉字的首字母 低版本浏览器可能不支持
			/* getChar(arr,empty) {
		if(!String.prototype.localeCompare)
			return null;
		 
		var letters = "*abcdefghjklmnopqrstwxyz".split('');
		var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
		 
		var segs = [];
		var curr;
		$.each(letters, function(i){
			curr = {letter: this, data:[]};
			$.each(arr, function() {
				if((!zh[i-1] || zh[i-1].localeCompare(this,"zh") <= 0) && this.localeCompare(zh[i],"zh") == -1) {
					curr.data.push(this);
				}
			});
			if(empty || curr.data.length) {
				segs.push(curr);
				curr.data.sort(function(a,b){
					return a.localeCompare(b,"zh");
				});
			}
		});
		return segs[0].letter[0];
	}	*/
		}
	}
</script>
