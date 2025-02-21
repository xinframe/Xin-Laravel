<?php

namespace App\Http\Admin\Controllers;

use App\Attribute\AdminController;
use App\Attribute\Authorize;
use App\Attribute\route\PostMapping;
use App\Attribute\route\RequestMapping;
use App\Enum\FileType;
use App\Http\BaseController;
use App\Service\impl\UpdateFileService;
use Illuminate\Http\JsonResponse;

/**
 * 上传文件
 */
#[AdminController]
#[RequestMapping('/admin/upload')]
class UpdateFileController extends BaseController
{
    public function __construct()
    {
        $this->service = new UpdateFileService;
    }

    /** 上传头像 */
    #[PostMapping('/avatar')] #[Authorize('admin.update.avatar')]
    public function avatar(): JsonResponse
    {
        $this->service->setFileType(FileType::IMAGE);
        return $this->service->upload(0);
    }

    /** 上传图片 */
    #[PostMapping('/image/{id}')] #[Authorize('admin.update.image')]
    public function image(int $id): JsonResponse
    {
        $this->service->setFileType(FileType::IMAGE);
        return $this->service->upload($id);
    }

    /** 上传视频 */
    #[PostMapping('/video/{id}')] #[Authorize('admin.update.video')]
    public function video(int $id): JsonResponse
    {
        $this->service->setFileType(FileType::VIDEO);
        return $this->service->upload($id);
    }

    /** 上传压缩文件 */
    #[PostMapping('/zip/{id}')] #[Authorize('admin.update.zip')]
    public function zip(int $id): JsonResponse
    {
        $this->service->setFileType(FileType::ZIP);
        return $this->service->upload($id);
    }

    /** 上传音频文件 */
    #[PostMapping('/audio/{id}')] #[Authorize('admin.update.mp3')]
    public function audio(int $id): JsonResponse
    {
        $this->service->setFileType(FileType::AUDIO);
        return $this->service->upload($id);
    }

    /** 上传其他类型文件 */
    #[PostMapping('/annex/{id}')] #[Authorize('admin.update.annex')]
    public function annex(int $id): JsonResponse
    {
        $this->service->setFileType(FileType::ANNEX);
        return $this->service->upload($id);
    }
}
