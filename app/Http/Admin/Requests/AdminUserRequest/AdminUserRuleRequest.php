<?php

namespace App\Http\Admin\Requests\AdminUserRequest;

use Illuminate\Foundation\Http\FormRequest;

class AdminUserRuleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'rule_id' => 'sometimes|required|integer|exists:admin_rule,id',
            'parent_id' => 'required|integer',
            'name' => 'required|string|max:50',
            'type' => 'required|integer|in:0,1,2',
            'key' => 'required|string|max:50',
            'show' => 'required|integer|between:0,1',
            'status' => 'required|integer|between:0,1',
            'sort' => 'required|integer',
            'path' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:255',
            'locale' => 'nullable|string|max:255',
        ];
    }
}
