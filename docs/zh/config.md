# 配置华为云密钥

## 获取密钥信息
登录华为云，进入到我的“我的凭证” -> “访问密钥”界面，生成新的秘钥并下载保存。

## 配置秘钥
### 引导式配置

可以通过`config add`直接进行密钥的添加：

```shell script
$ s config add 

? Please select a provider: (Use arrow keys)
  Alibaba Cloud (alibaba) 
  AWS (aws) 
  Azure (azure) 
  Baidu Cloud (baidu) 
  Google Cloud (google) 
❯ Huawei Cloud (huawei) 
  Tencent Cloud (tencent) 
  Custom (others) 
```

当使用者选择某个选项之后，系统会进行交互式引导：

```shell script
s config add 

? Please select a provider: Huawei Cloud (huawei)
? AccessKeyID **********
? SecretAccessKey **********
? Please create alias for key pair. If not, please enter to skip default
```

### 命令式配置

可以通过命令式直接进行密钥的添加：
```shell script
$ s config add --AccessKeyID ****** --SecretAccessKey ****** 
```

或：

```shell script
$ s config add -kl AccessKeyID,SecretAccessKey -il ${AccessKeyID},${SecretAccessKey}
```
