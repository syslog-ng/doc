---
title: macOS module suport status
description: This testing effort was part of a Google Summer Of Code project, the details of which will be outlined here.
permalink: :path
toc: true
---

[ref:origin]: https://syslog-macos-testing.gitbook.io/syslog-macos-testing/

### Acknowledgement

The [original testing][ref:origin] was made by Yash Mathne, and we would like to say a huge thank you for the great, detailed work.

### Testing Methodology

Only the building and the corresponding unit tests are guaranteed on x86 macOS. This is a documentation of the tests done on the various sub-components of syslog-ng on both the architectures.

Syslog-ng is composed of various modules, each with its own set of plugins. Plugins are primarily one of the following types:

* Source Drivers
* Destination Drivers
* Template Functions
* Rewrite Functions
* Parsers

Most of the template functions and rewrite functions are simple text manipulation functions without any external dependencies and are theoretically expected to work without a hunch. However, some of them do have external dependencies (e.g.: python template-function) and thus need to be tested.

### Testing results

Table of the testing status of the various modules.

 |                         Module                        | Plugins |    Intel    | Apple Silicon |
 | :---------------------------------------------------: | :-----: | :---------: | :-----------: |
 |             [affile](modules/affile)                  |    6    |    Tested   |     Tested    |
 |          [afmongodb](modules/afmongodb)               |    1    |    Tested   |     Tested    |
 |             [afprog](modules/afprog)                  |    2    |    Tested   |     Tested    |
 |             [afsmtp](modules/afsmtp)                  |    1    | Tested \[F] |  Tested \[F]  |
 |           [afsocket](modules/afsocket)                |    17   |    Tested   |     Tested    |
 |              [afsql](modules/afsql)                   |    1    | Tested \[F] |  Tested \[F]  |
 |             [afuser](modules/afuser)                  |    1    |    Tested   |     Tested    |
 | [elasticsearch-http](modules/elasticsearch-http)      |    1    |    Tested   |     Tested    |
 |               [http](modules/http)                    |    1    |    Tested   |     Tested    |
 |         [mod-python](modules/mod-python)              |    7    |    Tested   |     Tested    |
 |         [pseudofile](modules/pseudofile)              |    1    |    Tested   |     Tested    |
 |              [redis](modules/redis)                   |    1    |    Tested   |     Tested    |
 |            [riemann](modules/riemann)                 |    1    |    Tested   |     Tested    |
 |      [system-source](modules/system-source)           |    1    | Tested \[F] |  Tested \[F]  |
