# Configuring a Huawei Cloud Key

## Obtaining Key Information
Log in to Huawei Cloud, go to the **My Credentials** > **Access Keys** page, generate an access key, and download it.

## Configuring a Key
### Using Wizard

Use `config add` to add a key.

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

After selecting a provider, you will be prompted to enter the corresponding information:

```shell script
s config add 

? Please select a provider: Huawei Cloud (huawei)
? AccessKeyID **********
? SecretAccessKey **********
? Please create alias for key pair. If not, please enter to skip default
```

### Using a Command

Add a key using a command:
```shell script
$ s config add --AccessKeyID ****** --SecretAccessKey ****** 
```

Or,

```shell script
$ s config add -kl AccessKeyID,SecretAccessKey -il ${AccessKeyID},${SecretAccessKey}
```
