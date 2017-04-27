### Packaging

#### How to use the `packaging` feature  ?

`sqz.config.yml` 

```yaml
packaging:
  - node_modules
#  - other_dir
#  - other_file
```

This means that `node_modules` will be included in the microservice's *.zip package for later usage 
on the cloud environment.

#### What's the difference between `inclusions` and `packaging` ?

Well, `inclusions` feature is used only to create symlinks for some required resources which are used later
for compiling the source code and `packaging` will raw store specified resources on the microservice compiled package.
