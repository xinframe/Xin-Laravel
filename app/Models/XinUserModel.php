<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Class XinUser
 *
 * @property int $user_id
 * @property string $mobile
 * @property string $username
 * @property string $email
 * @property string $password
 * @property string $nickname
 * @property int $avatar_id
 * @property string $gender
 * @property Carbon|null $birthday
 * @property int $group_id
 * @property int $money
 * @property int $score
 * @property string $motto
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @mixin IdeHelperModel
 */
class XinUserModel extends Model
{
    protected $table = 'xin_user';

    protected $primaryKey = 'user_id';

    protected $casts = [
        'avatar_id' => 'int',
        'birthday' => 'datetime',
        'group_id' => 'int',
        'money' => 'int',
        'score' => 'int',
    ];

    protected $hidden = [
        'password',
        'avatar',
    ];

    protected $fillable = [
        'mobile',
        'username',
        'email',
        'password',
        'nickname',
        'avatar_id',
        'gender',
        'birthday',
        'group_id',
        'money',
        'score',
        'motto',
        'status',
    ];

    protected $appends = [
        'avatar_url',
    ];

    public function avatar(): HasOne
    {
        return $this->hasOne(FileModel::class, 'file_id', 'avatar_id');
    }

    // 头像地址
    protected function avatarUrl(): Attribute
    {
        return new Attribute(get: fn () => $this->avatar->preview_url ?? null);
    }
}
