<?php

namespace App\Http\Admin\Controllers;

use App\Attribute\AdminController;
use App\Attribute\Authorize;
use App\Attribute\route\DeleteMapping;
use App\Attribute\route\GetMapping;
use App\Attribute\route\PostMapping;
use App\Attribute\route\PutMapping;
use App\Attribute\route\RequestMapping;
use App\Http\Admin\Requests\FileUpdateInfoRequest;
use App\Http\BaseController;
use App\Models\FileModel;
use App\Service\impl\FileService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * 文件列表
 */
#[AdminController]
#[RequestMapping('/file/list')]
class FileListController extends BaseController
{
    protected array $noPermission = ['download'];

    public function __construct()
    {
        $this->model = new FileModel;
        $this->searchField = [
            'group_id' => '=',
            'name' => 'like',
            'file_type' => '=',
        ];
    }

    /** 获取文件列表 */
    #[GetMapping] #[Authorize('file.list.list')]
    public function list(): JsonResponse
    {
        return $this->listResponse();
    }

    /** 修改文件信息 */
    #[PutMapping] #[Authorize('file.list.edit')]
    public function edit(FileUpdateInfoRequest $request): JsonResponse
    {
        return $this->editResponse($request);
    }

    /** 删除文件 */
    #[DeleteMapping] #[Authorize('file.list.delete')]
    public function delete(): JsonResponse
    {
        // TODO 删除文件 （待完成） 删除本地文件数据！
        return $this->deleteResponse();
    }

    /** 下载文件 */
    #[GetMapping('/download/{id}')]
    public function download(int $id): StreamedResponse
    {
        $fileService = new FileService;

        return $fileService->download($id);
    }
}
