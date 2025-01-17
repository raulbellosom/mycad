import React, { useState } from 'react';
import ModalViewer from '../Modals/ModalViewer';
const PDFReader = React.lazy(() => import('../PDFReader/PDFReader'));
import ActionButtons from '../ActionButtons/ActionButtons';
import DownloadFileImage from '../../assets/images/download_file.webp';
import { API_URL, downloadFile } from '../../services/api';
import { BiError } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { MdCloudDone, MdRemoveRedEye, MdSaveAlt } from 'react-icons/md';
import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
  FaFileImage,
  FaFilePowerpoint,
  FaFileWord,
  FaFile,
  FaFileVideo,
} from 'react-icons/fa';
import classNames from 'classnames';
import { FallingLines } from 'react-loader-spinner';

const FileIcon = ({ file, className, size, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDownloadOpen, setIsModalDownloadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloadingError, setIsDownloadingError] = useState(false);
  const iconSize = size || 22;

  const getIcon = (file) => {
    if (file.type.includes('pdf')) {
      return <FaFilePdf className="text-red-500" size={iconSize} />;
    } else if (
      file.type.includes('excel') ||
      file.type.includes('spreadsheetml')
    ) {
      return <FaFileExcel className="text-green-500" size={iconSize} />;
    } else if (file.type.includes('csv')) {
      return <FaFileCsv className="text-lime-500" size={iconSize} />;
    } else if (file.type.includes('image')) {
      return <FaFileImage className="text-cyan-500" size={iconSize} />;
    } else if (file.type.includes('powerpoint')) {
      return <FaFilePowerpoint className="text-orange-500" size={iconSize} />;
    } else if (file.type.includes('word')) {
      return <FaFileWord className="text-blue-500" size={iconSize} />;
    } else if (file.type.includes('video')) {
      return <FaFileVideo className="text-indigo-500" size={iconSize} />;
    } else {
      return <FaFile className="text-stone-400" size={iconSize} />;
    }
  };

  const handleOpenPdf = () => {
    if (file && file.type.includes('pdf')) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setIsDownloadingError(false);
    setIsDownloaded(false);

    downloadFile(file)
      .then(() => {
        setIsDownloaded(true);
      })
      .catch(() => {
        setIsDownloadingError(true);
      })
      .finally(() => {
        setIsDownloading(false);
      });
  };

  return (
    <>
      <div
        className={classNames(
          'h-full w-full flex items-center gap-4 justify-between py-2 px-2 rounded-md transition-all cursor-pointer hover:bg-stone-100 ease-in-out duration-100 truncate',
          className,
        )}
      >
        <div className="flex items-center truncate">
          <span>{getIcon(file)}</span>
          <span className="ml-2 truncate text-sm md:text-base">
            {file.name}
          </span>
        </div>
        <div className="flex items-center justify-evenly gap-2">
          {file.type.includes('pdf') && (
            <span onClick={handleOpenPdf}>
              <MdRemoveRedEye
                className="text-blue-500 cursor-pointer"
                size={iconSize}
              />
            </span>
          )}
          {!(file instanceof File) && (
            <span onClick={() => setIsModalDownloadOpen(true)}>
              <MdSaveAlt
                className="text-green-500 cursor-pointer"
                size={iconSize}
              />
            </span>
          )}

          {onRemove && (
            <span>
              <IoClose
                className=" text-red-500 cursor-pointer"
                size={iconSize}
                onClick={onRemove}
              />
            </span>
          )}
        </div>
      </div>
      {isModalOpen && (
        <ModalViewer
          title={selectedFile.name}
          isOpenModal={isModalOpen}
          onCloseModal={handleCloseModal}
          dismissible={true}
          size="4xl"
        >
          {window.innerWidth < 768 ? (
            <PDFReader
              file={file instanceof File ? file : `${API_URL}/${file.url}`}
            />
          ) : (
            <embed
              src={
                file instanceof File
                  ? URL.createObjectURL(file)
                  : `${API_URL}/${file.url}`
              }
              type="application/pdf"
              width="100%"
              height="100%"
              className="min-h-[80vh]"
            />
          )}
        </ModalViewer>
      )}
      {isModalDownloadOpen && (
        <ModalViewer
          title="Descargar Archivo"
          isOpenModal={isModalDownloadOpen}
          onCloseModal={() => setIsModalDownloadOpen(false)}
        >
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <img
              src={DownloadFileImage}
              alt="Download File"
              className="h-48 w-auto"
            />
            <p className="text-lg font-semibold">
              ¿Deseas descargar el archivo?
            </p>
            <span className="text-sm text-neutral-500">{file.name}</span>
            <div className="flex gap-4">
              {!isDownloading && (
                <ActionButtons
                  extraActions={[
                    {
                      label: 'Descargar',
                      icon: MdSaveAlt,
                      action: handleDownload,
                      color: 'green',
                    },
                  ]}
                  onCancel={() => setIsModalDownloadOpen(false)}
                />
              )}
            </div>
            {/* Barra de progreso */}
            {isDownloading && (
              <FallingLines
                width={80}
                color="#ff5a1f"
                ariaLabel="falling-circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            )}
            {isDownloaded && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500">Descargado</span>
                <MdCloudDone className="text-green-500" size={iconSize} />
              </div>
            )}
            {isDownloadingError && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-red-500">Error al descargar</span>
                <BiError className="text-red-500" size={iconSize} />
              </div>
            )}
          </div>
        </ModalViewer>
      )}
    </>
  );
};

export default FileIcon;
