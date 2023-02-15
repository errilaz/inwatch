/**

ADAPTED FROM: https://github.com/Anadian/regex-translator

Author: Anadian

Code license: MIT
```
  Copyright 2020 Anadian
  Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:
  The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
*/

type Flavour = keyof typeof MetaRegexObject

export function getExtendedRegex(re: RegExp) {
  const mediary = getMediaryObjectFromRegexString(re.source, "ecma")
  return getRegexStringFromMediaryObject(mediary, "extended")
}

const MetaRegexObject = {
  "extended": {
    "NONCAPTURE_GROUP": {
      to: {
        search_regex: /([^\\])\(\?:/g,
        replace_string: '$1<%NONCAPTURE_GROUP%>'
      },
      from: {
        search_regex: /<%NONCAPTURE_GROUP%>/g,
        replace_string: '(?:'
      }
    },
    "NAMED_CAPTURE_GROUP": {
      to: {
        search_regex: /([^\\])\(\?P?[<']([^>':]+)[>']/g,
        replace_string: '$1<%NAMED_CAPTURE_GROUP_START:$2:NAMED_CAPTURE_GROUP_END%>'
      },
      from: {
        search_regex: /<%NAMED_CAPTURE_GROUP_START:([^:]+):NAMED_CAPTURE_GROUP_END%>/g,
        replace_string: '(?<$1>'
      }
    },
    "LLT": {
      to: {
        search_regex: /<([^%])/g,
        replace_string: '<%LLT%>$1'
      },
      from: {
        search_regex: /<%LLT%>/g,
        replace_string: '<'
      }
    },
    "LGT": {
      to: {
        search_regex: /([^%])>/g,
        replace_string: '$1<%LGT%>'
      },
      from: {
        search_regex: /<%LGT%>/g,
        replace_string: '>'
      }
    },
    "CHARACTER_CLASS_CODE": {
      to: {
        search_regex: /<CHARACTER_CLASS_START:(.*?):CHARACTER_CLASS_END>/g,
        replace_string: null
      },
      from: {
        search_regex: /<CHARACTER_CLASS_CODE_START:(\d+):CHARACTER_CLASS_CODE_END>/g,
        replace_string: null
      }
    },
    "CHARACTER_CLASS": {
      to: {
        search_regex: /([^\\])\[(([^\]]{1,2})|([^:\]]([^\]]*?)[^:]))\]/g,
        replace_string: '$1<CHARACTER_CLASS_START:$2:CHARACTER_CLASS_END>'
      },
      from: {
        search_regex: /<CHARACTER_CLASS_START:(.*?):CHARACTER_CLASS_END>/g,
        replace_string: '[$1]'
      }
    },
    "LVRQ": {
      to: {
        search_regex: /([^\\])\{(\d*),(\d*)\}\?/g,
        replace_string: '$1<LVRQ_START:$2:$3:LVRQ_END>'
      },
      from: {
        search_regex: /<LVRQ_START:(\d*):(\d*):LVRQ_END>/g,
        replace_string: '{$1,$2}?'
      }
    },
    "VRQ": {
      to: {
        search_regex: /([^\\])\{(\d*),(\d*)\}/g,
        replace_string: '$1<VRQ_START:$2:$3:VRQ_END>'
      },
      from: {
        search_regex: /<VRQ_START:(\d*):(\d*):VRQ_END>/g,
        replace_string: '{$1,$2}'
      }
    },
    "LOMQ": {
      to: {
        search_regex: /\+\?/g,
        replace_string: '<LOMQ>'
      },
      from: {
        search_regex: /<LOMQ>/g,
        replace_string: '+?'
      }
    },
    "LZMQ": {
      to: {
        search_regex: /\*\?/g,
        replace_string: '<LZMQ>'
      },
      from: {
        search_regex: /<LZMQ>/g,
        replace_string: '*?'
      }
    },
    "LOP": {
      to: {
        search_regex: /\\\(/g,
        replace_string: '<LOP>'
      },
      from: {
        search_regex: /<LOP>/g,
        replace_string: '\\('
      }
    },
    "LCP": {
      to: {
        search_regex: /\\\)/g,
        replace_string: '<LCP>'
      },
      from: {
        search_regex: /<LCP>/g,
        replace_string: '\\)'
      }
    },
    "LOB": {
      to: {
        search_regex: /\\\[/g,
        replace_string: '<%LOB%>'
      },
      from: {
        search_regex: /<%LOB%>/g,
        replace_string: '\\['
      }
    },
    "LCB": {
      to: {
        search_regex: /\\\]/g,
        replace_string: '<%LCB%>'
      },
      from: {
        search_regex: /<%LCB%>/g,
        replace_string: '\\]'
      }
    },
    "LOC": {
      to: {
        search_regex: /\\\{/g,
        replace_string: '<%LOC%>'
      },
      from: {
        search_regex: /<%LOC%>/g,
        replace_string: '\\{'
      }
    },
    "LCC": {
      to: {
        search_regex: /\\\}/g,
        replace_string: '<%LCC%>'
      },
      from: {
        search_regex: /<%LCC%>/g,
        replace_string: '\\}'
      }
    },
    "MOP": {
      to: {
        search_regex: /\(/g,
        replace_string: '<MOP>'
      },
      from: {
        search_regex: /<MOP>/g,
        replace_string: '('
      }
    },
    "MCP": {
      to: {
        search_regex: /\)/g,
        replace_string: '<MCP>'
      },
      from: {
        search_regex: /<MCP>/g,
        replace_string: ')'
      }
    },
    "LB": {
      to: {
        search_regex: /\n/g,
        replace_string: '<LB>'
      },
      from: {
        search_regex: /<LB>/g,
        replace_string: '\\n'
      }
    },
    "LBS": {
      to: {
        search_regex: /\\\\/g,
        replace_string: '<LBS>'
      },
      from: {
        search_regex: /<LBS>/g,
        replace_string: '\\\\'
      }
    },
    "LPS": {
      to: {
        search_regex: /\\\+/g,
        replace_string: '<LPS>'
      },
      from: {
        search_regex: /<LPS>/g,
        replace_string: '\\+'
      }
    },
    "LP": {
      to: {
        search_regex: /\\\./g,
        replace_string: '<LP>'
      },
      from: {
        search_regex: /<LP>/g,
        replace_string: '\\.'
      }
    },
    "LCS": {
      to: {
        search_regex: /\\\^/g,
        replace_string: '<LCS>'
      },
      from: {
        search_regex: /<LCS>/g,
        replace_string: '\\^'
      }
    },
    "LDS": {
      to: {
        search_regex: /\\\$/g,
        replace_string: '<LDS>'
      },
      from: {
        search_regex: /<LDS>/g,
        replace_string: '\\$'
      }
    },
    "LES": {
      to: {
        search_regex: /\=/g,
        replace_string: '<LES>'
      },
      from: {
        search_regex: /<LES>/g,
        replace_string: '\\='
      }
    },
    "LQM": {
      to: {
        search_regex: /\\\?/g,
        replace_string: '<LQM>'
      },
      from: {
        search_regex: /<LQM>/g,
        replace_string: '\\?'
      }
    },
    "LAS": {
      to: {
        search_regex: /\\\*/g,
        replace_string: '<LAS>'
      },
      from: {
        search_regex: /<LAS>/g,
        replace_string: '\\*'
      }
    },
    "LPIPE": {
      to: {
        search_regex: /\\\|/g,
        replace_string: '<LPIPE>'
      },
      from: {
        search_regex: /<LPIPE>/g,
        replace_string: '\\|'
      }
    },
    "ORA": {
      to: {
        search_regex: /\|/g,
        replace_string: '<ORA>'
      },
      from: {
        search_regex: /<ORA>/g,
        replace_string: '|'
      }
    },
    "LFS": {
      to: {
        search_regex: /\\\//g,
        replace_string: '<LFS>'
      },
      from: {
        search_regex: /<LFS>/g,
        replace_string: '\\/'
      }
    },
    "OMQ": {
      to: {
        search_regex: /\+/g,
        replace_string: '<OMQ>'
      },
      from: {
        search_regex: /<OMQ>/g,
        replace_string: '+'
      }
    },
    "ZOQ": {
      to: {
        search_regex: /\?/g,
        replace_string: '<ZOQ>'
      },
      from: {
        search_regex: /<ZOQ>/g,
        replace_string: '?'
      }
    },
    "ZMQ": {
      to: {
        search_regex: /\*/g,
        replace_string: '<ZMQ>'
      },
      from: {
        search_regex: /<ZMQ>/g,
        replace_string: '*'
      }
    },
    "MAC": {
      to: {
        search_regex: /\./g,
        replace_string: '<MAC>'
      },
      from: {
        search_regex: /<MAC>/g,
        replace_string: '.'
      }
    },
    "SL": {
      to: {
        search_regex: /\^/g,
        replace_string: '<SL>'
      },
      from: {
        search_regex: /<SL>/g,
        replace_string: '^'
      }
    },
    "EL": {
      to: {
        search_regex: /\$/g,
        replace_string: '<EL>'
      },
      from: {
        search_regex: /<EL>/g,
        replace_string: '$'
      }
    },
    "RS": {
      to: {
        search_regex: /\//g,
        replace_string: '<RS>'
      },
      from: {
        search_regex: /<RS>/g,
        replace_string: '/'
      }
    },
    "CC_DIGIT": {
      to: {
        search_regex: /(\[:digit:\])|(\\d)/g,
        replace_string: '<CC_DIGIT>'
      },
      from: {
        search_regex: /<CC_DIGIT>/g,
        replace_string: '[0-9]'
      }
    },
    "CC_NOTDIGIT": {
      to: {
        search_regex: /\\D/g,
        replace_string: '<CC_NOTDIGIT>'
      },
      from: {
        search_regex: /<CC_NOTDIGIT>/g,
        replace_string: '[^0-9]'
      }
    },
    "CC_WORD": {
      to: {
        search_regex: /\\w/g,
        replace_string: '<CC_WORD>'
      },
      from: {
        search_regex: /<CC_WORD>/g,
        replace_string: '[A-Za-z0-9_]'
      }
    },
    "CC_NOTWORD": {
      to: {
        search_regex: /\\W/g,
        replace_string: '<CC_NOTWORD>'
      },
      from: {
        search_regex: /<CC_NOTWORD>/g,
        replace_string: '[^A-Za-z0-9_]'
      }
    },
    "CC_alnum": {
      to: {
        search_regex: /\[:alnum:\]/g,
        replace_string: '<CC_alnum>'
      },
      from: {
        search_regex: /<CC_alnum>/g,
        replace_string: '[A-Za-z0-9]'
      }
    },
    "CC_alpha": {
      to: {
        search_regex: /\[:alpha:\]/g,
        replace_string: '<CC_alpha>'
      },
      from: {
        search_regex: /<CC_alpha>/g,
        replace_string: '[A-Za-z]'
      }
    },
    "CC_graph": {
      to: {
        search_regex: /\[:graph:\]/g,
        replace_string: '<CC_graph>'
      },
      from: {
        search_regex: /<CC_graph>/g,
        replace_string: '[!-~]'
      }
    },
    "CC_lower": {
      to: {
        search_regex: /\[:lower:\]/g,
        replace_string: '<CC_lower>'
      },
      from: {
        search_regex: /<CC_lower>/g,
        replace_string: '[a-z]'
      }
    },
    "CC_print": {
      to: {
        search_regex: /\[:print:\]/g,
        replace_string: '<CC_print>'
      },
      from: {
        search_regex: /<CC_print>/g,
        replace_string: '[ -~]'
      }
    },
    "CC_punct": {
      to: {
        search_regex: /\[:punct:\]/g,
        replace_string: '<CC_punct>'
      },
      from: {
        search_regex: /<CC_punct>/g,
        replace_string: '[!-\\/:-@[-`{-~]'
      }
    },
    "CC_upper": {
      to: {
        search_regex: /\[:upper:\]/g,
        replace_string: '<CC_upper>'
      },
      from: {
        search_regex: /<CC_upper>/g,
        replace_string: '[A-Z]'
      }
    },
    "CC_xdigit": {
      to: {
        search_regex: /\[:xdigit:\]/g,
        replace_string: '<CC_xdigit>'
      },
      from: {
        search_regex: /<CC_xdigit>/g,
        replace_string: '[0-9A-Fa-f]'
      }
    },
    "CC_NOTNEWLINE": {
      to: {
        search_regex: /\\N/g,
        replace_string: '<CC_NOTNEWLINE>'
      },
      from: {
        search_regex: /<CC_NOTNEWLINE>/g,
        replace_string: '[^\\r\\n]'
      }
    },
    "CC_HORIZONTALSPACE": {
      to: {
        search_regex: /(\[:blank:\])|(\\h)/g,
        replace_string: '<CC_HORIZONTALSPACE>'
      },
      from: {
        search_regex: /<CC_HORIZONTALSPACE>/g,
        replace_string: '[ \\t]'
      }
    },
    "CC_NOTHORIZONTALSPACE": {
      to: {
        search_regex: /\\H/g,
        replace_string: '<CC_NOTHORIZONTALSPACE>'
      },
      from: {
        search_regex: /<CC_NOTHORIZONTALSPACE>/g,
        replace_string: '[^ \\t]'
      }
    },
    "CC_VERTICALSPACE": {
      to: {
        search_regex: /(\[:space:\])|(\\s)|(\\v)/g,
        replace_string: '<CC_VERTICALSPACE>'
      },
      from: {
        search_regex: /<CC_VERTICALSPACE>/g,
        replace_string: '[\\f\\n\\r\\t\\v]'
      }
    },
    "CC_NOTVERTICALSPACE": {
      to: {
        search_regex: /(\\S)|(\\V)/g,
        replace_string: '<CC_NOTVERTICALSPACE>'
      },
      from: {
        search_regex: /<CC_NOTVERTICALSPACE>/g,
        replace_string: '[^\\f\\n\\r\\t\\v]'
      }
    },
    "CC_R": {
      to: {
        search_regex: /\[:R:\]/g,
        replace_string: '<CC_R>'
      },
      from: {
        search_regex: /<CC_R>/g,
        replace_string: '[\\r\\n\\f\\t\\v]'
      }
    }
  },
  "ecma": {
    "NONCAPTURE_GROUP": {
      to: {
        search_regex: /([^\\]?)\(\?:/g,
        replace_string: '$1<%NONCAPTURE_GROUP%>'
      },
      from: {
        search_regex: /<%NONCAPTURE_GROUP%>/g,
        replace_string: '(?:'
      }
    },
    "NAMED_CAPTURE_GROUP": {
      to: {
        search_regex: /([^\\]?)\(\?<([^>:]+)>/g,
        replace_string: '$1<%NAMED_CAPTURE_GROUP_START:$2:NAMED_CAPTURE_GROUP_END%>'
      },
      from: {
        search_regex: /<%NAMED_CAPTURE_GROUP_START:([^:]+):NAMED_CAPTURE_GROUP_END%>/g,
        replace_string: '(?<$1>'
      }
    },
    "LLT": {
      to: {
        search_regex: /<([^%])/g,
        replace_string: '<%LLT%>$1'
      },
      from: {
        search_regex: /<%LLT%>/g,
        replace_string: '<'
      }
    },
    "LGT": {
      to: {
        search_regex: /([^%])>/g,
        replace_string: '$1<%LGT%>'
      },
      from: {
        search_regex: /<%LGT%>/g,
        replace_string: '>'
      }
    },
    "CHARACTER_CLASS_CODE": {
      to: {
        search_regex: /<CHARACTER_CLASS_START:(.*?):CHARACTER_CLASS_END>/g,
        replace_string: null
      },
      from: {
        search_regex: /<CHARACTER_CLASS_CODE_START:(\d+):CHARACTER_CLASS_CODE_END>/g,
        replace_string: null
      }
    },
    "CHARACTER_CLASS": {
      to: {
        search_regex: /([^\\])\[(([^\]]{1,2})|([^:\]]([^\]]*?)[^:]))\]/g,
        replace_string: '$1<CHARACTER_CLASS_START:$2:CHARACTER_CLASS_END>'
      },
      from: {
        search_regex: /<CHARACTER_CLASS_START:(.*?):CHARACTER_CLASS_END>/g,
        replace_string: '[$1]'
      }
    },
    "LVRQ": {
      to: {
        search_regex: /([^\\])\{(\d*),(\d*)\}\?/g,
        replace_string: '$1<LVRQ_START:$2:$3:LVRQ_END>'
      },
      from: {
        search_regex: /<LVRQ_START:(\d*):(\d*):LVRQ_END>/g,
        replace_string: '{$1,$2}?'
      }
    },
    "VRQ": {
      to: {
        search_regex: /([^\\])\{(\d*),(\d*)\}/g,
        replace_string: '$1<VRQ_START:$2:$3:VRQ_END>'
      },
      from: {
        search_regex: /<VRQ_START:(\d*):(\d*):VRQ_END>/g,
        replace_string: '{$1,$2}'
      }
    },
    "LOMQ": {
      to: {
        search_regex: /\+\?/g,
        replace_string: '<LOMQ>'
      },
      from: {
        search_regex: /<LOMQ>/g,
        replace_string: '+?'
      }
    },
    "LZMQ": {
      to: {
        search_regex: /\*\?/g,
        replace_string: '<LZMQ>'
      },
      from: {
        search_regex: /<LZMQ>/g,
        replace_string: '*?'
      }
    },
    "LOP": {
      to: {
        search_regex: /\\\(/g,
        replace_string: '<LOP>'
      },
      from: {
        search_regex: /<LOP>/g,
        replace_string: '\\('
      }
    },
    "LCP": {
      to: {
        search_regex: /\\\)/g,
        replace_string: '<LCP>'
      },
      from: {
        search_regex: /<LCP>/g,
        replace_string: '\\)'
      }
    },
    "LOB": {
      to: {
        search_regex: /\\\[/g,
        replace_string: '<%LOB%>'
      },
      from: {
        search_regex: /<%LOB%>/g,
        replace_string: '\\['
      }
    },
    "LCB": {
      to: {
        search_regex: /\\\]/g,
        replace_string: '<%LCB%>'
      },
      from: {
        search_regex: /<%LCB%>/g,
        replace_string: '\\]'
      }
    },
    "LOC": {
      to: {
        search_regex: /\\\{/g,
        replace_string: '<%LOC%>'
      },
      from: {
        search_regex: /<%LOC%>/g,
        replace_string: '\\{'
      }
    },
    "LCC": {
      to: {
        search_regex: /\\\}/g,
        replace_string: '<%LCC%>'
      },
      from: {
        search_regex: /<%LCC%>/g,
        replace_string: '\\}'
      }
    },
    "MOP": {
      to: {
        search_regex: /\(/g,
        replace_string: '<MOP>'
      },
      from: {
        search_regex: /<MOP>/g,
        replace_string: '('
      }
    },
    "MCP": {
      to: {
        search_regex: /\)/g,
        replace_string: '<MCP>'
      },
      from: {
        search_regex: /<MCP>/g,
        replace_string: ')'
      }
    },
    "LB": {
      to: {
        search_regex: /\n/g,
        replace_string: '<LB>'
      },
      from: {
        search_regex: /<LB>/g,
        replace_string: '\\n'
      }
    },
    "LBS": {
      to: {
        search_regex: /\\\\/g,
        replace_string: '<LBS>'
      },
      from: {
        search_regex: /<LBS>/g,
        replace_string: '\\\\'
      }
    },
    "LPS": {
      to: {
        search_regex: /\\\+/g,
        replace_string: '<LPS>'
      },
      from: {
        search_regex: /<LPS>/g,
        replace_string: '\\+'
      }
    },
    "LP": {
      to: {
        search_regex: /\\\./g,
        replace_string: '<LP>'
      },
      from: {
        search_regex: /<LP>/g,
        replace_string: '\\.'
      }
    },
    "LCS": {
      to: {
        search_regex: /\\\^/g,
        replace_string: '<LCS>'
      },
      from: {
        search_regex: /<LCS>/g,
        replace_string: '\\^'
      }
    },
    "LDS": {
      to: {
        search_regex: /\\\$/g,
        replace_string: '<LDS>'
      },
      from: {
        search_regex: /<LDS>/g,
        replace_string: '\\$'
      }
    },
    "LES": {
      to: {
        search_regex: /\=/g,
        replace_string: '<LES>'
      },
      from: {
        search_regex: /<LES>/g,
        replace_string: '\\='
      }
    },
    "LQM": {
      to: {
        search_regex: /\\\?/g,
        replace_string: '<LQM>'
      },
      from: {
        search_regex: /<LQM>/g,
        replace_string: '\\?'
      }
    },
    "LAS": {
      to: {
        search_regex: /\\\*/g,
        replace_string: '<LAS>'
      },
      from: {
        search_regex: /<LAS>/g,
        replace_string: '\\*'
      }
    },
    "LPIPE": {
      to: {
        search_regex: /\\\|/g,
        replace_string: '<LPIPE>'
      },
      from: {
        search_regex: /<LPIPE>/g,
        replace_string: '\\|'
      }
    },
    "ORA": {
      to: {
        search_regex: /\|/g,
        replace_string: '<ORA>'
      },
      from: {
        search_regex: /<ORA>/g,
        replace_string: '|'
      }
    },
    "LFS": {
      to: {
        search_regex: /\\\//g,
        replace_string: '<LFS>'
      },
      from: {
        search_regex: /<LFS>/g,
        replace_string: '\\/'
      }
    },
    "OMQ": {
      to: {
        search_regex: /\+/g,
        replace_string: '<OMQ>'
      },
      from: {
        search_regex: /<OMQ>/g,
        replace_string: '+'
      }
    },
    "ZOQ": {
      to: {
        search_regex: /\?/g,
        replace_string: '<ZOQ>'
      },
      from: {
        search_regex: /<ZOQ>/g,
        replace_string: '?'
      }
    },
    "ZMQ": {
      to: {
        search_regex: /\*/g,
        replace_string: '<ZMQ>'
      },
      from: {
        search_regex: /<ZMQ>/g,
        replace_string: '*'
      }
    },
    "MAC": {
      to: {
        search_regex: /\./g,
        replace_string: '<MAC>'
      },
      from: {
        search_regex: /<MAC>/g,
        replace_string: '.'
      }
    },
    "SL": {
      to: {
        search_regex: /\^/g,
        replace_string: '<SL>'
      },
      from: {
        search_regex: /<SL>/g,
        replace_string: '^'
      }
    },
    "EL": {
      to: {
        search_regex: /\$/g,
        replace_string: '<EL>'
      },
      from: {
        search_regex: /<EL>/g,
        replace_string: '$'
      }
    },
    "RS": {
      to: {
        search_regex: /\//g,
        replace_string: '<RS>'
      },
      from: {
        search_regex: /<RS>/g,
        replace_string: '/'
      }
    },
    "CC_DIGIT": {
      to: {
        search_regex: /(\[:digit:\])|(\\d)/g,
        replace_string: '<CC_DIGIT>'
      },
      from: {
        search_regex: /<CC_DIGIT>/g,
        replace_string: '[0-9]'
      }
    },
    "CC_NOTDIGIT": {
      to: {
        search_regex: /\\D/g,
        replace_string: '<CC_NOTDIGIT>'
      },
      from: {
        search_regex: /<CC_NOTDIGIT>/g,
        replace_string: '[^0-9]'
      }
    },
    "CC_WORD": {
      to: {
        search_regex: /\\w/g,
        replace_string: '<CC_WORD>'
      },
      from: {
        search_regex: /<CC_WORD>/g,
        replace_string: '[A-Za-z0-9_]'
      }
    },
    "CC_NOTWORD": {
      to: {
        search_regex: /\\W/g,
        replace_string: '<CC_NOTWORD>'
      },
      from: {
        search_regex: /<CC_NOTWORD>/g,
        replace_string: '[^A-Za-z0-9_]'
      }
    },
    "CC_alnum": {
      to: {
        search_regex: /\[:alnum:\]/g,
        replace_string: '<CC_alnum>'
      },
      from: {
        search_regex: /<CC_alnum>/g,
        replace_string: '[A-Za-z0-9]'
      }
    },
    "CC_alpha": {
      to: {
        search_regex: /\[:alpha:\]/g,
        replace_string: '<CC_alpha>'
      },
      from: {
        search_regex: /<CC_alpha>/g,
        replace_string: '[A-Za-z]'
      }
    },
    "CC_graph": {
      to: {
        search_regex: /\[:graph:\]/g,
        replace_string: '<CC_graph>'
      },
      from: {
        search_regex: /<CC_graph>/g,
        replace_string: '[!-~]'
      }
    },
    "CC_lower": {
      to: {
        search_regex: /\[:lower:\]/g,
        replace_string: '<CC_lower>'
      },
      from: {
        search_regex: /<CC_lower>/g,
        replace_string: '[a-z]'
      }
    },
    "CC_print": {
      to: {
        search_regex: /\[:print:\]/g,
        replace_string: '<CC_print>'
      },
      from: {
        search_regex: /<CC_print>/g,
        replace_string: '[ -~]'
      }
    },
    "CC_punct": {
      to: {
        search_regex: /\[:punct:\]/g,
        replace_string: '<CC_punct>'
      },
      from: {
        search_regex: /<CC_punct>/g,
        replace_string: '[!-\\/:-@[-`{-~]'
      }
    },
    "CC_upper": {
      to: {
        search_regex: /\[:upper:\]/g,
        replace_string: '<CC_upper>'
      },
      from: {
        search_regex: /<CC_upper>/g,
        replace_string: '[A-Z]'
      }
    },
    "CC_xdigit": {
      to: {
        search_regex: /\[:xdigit:\]/g,
        replace_string: '<CC_xdigit>'
      },
      from: {
        search_regex: /<CC_xdigit>/g,
        replace_string: '[0-9A-Fa-f]'
      }
    },
    "CC_NOTNEWLINE": {
      to: {
        search_regex: /\\N/g,
        replace_string: '<CC_NOTNEWLINE>'
      },
      from: {
        search_regex: /<CC_NOTNEWLINE>/g,
        replace_string: '[^\\r\\n]'
      }
    },
    "CC_HORIZONTALSPACE": {
      to: {
        search_regex: /(\[:blank:\])|(\\h)/g,
        replace_string: '<CC_HORIZONTALSPACE>'
      },
      from: {
        search_regex: /<CC_HORIZONTALSPACE>/g,
        replace_string: '[ \\t]'
      }
    },
    "CC_NOTHORIZONTALSPACE": {
      to: {
        search_regex: /\\H/g,
        replace_string: '<CC_NOTHORIZONTALSPACE>'
      },
      from: {
        search_regex: /<CC_NOTHORIZONTALSPACE>/g,
        replace_string: '[^ \\t]'
      }
    },
    "CC_VERTICALSPACE": {
      to: {
        search_regex: /(\[:space:\])|(\\s)|(\\v)/g,
        replace_string: '<CC_VERTICALSPACE>'
      },
      from: {
        search_regex: /<CC_VERTICALSPACE>/g,
        replace_string: '[\\f\\n\\r\\t\\v]'
      }
    },
    "CC_NOTVERTICALSPACE": {
      to: {
        search_regex: /(\\S)|(\\V)/g,
        replace_string: '<CC_NOTVERTICALSPACE>'
      },
      from: {
        search_regex: /<CC_NOTVERTICALSPACE>/g,
        replace_string: '[^\\f\\n\\r\\t\\v]'
      }
    },
    "CC_R": {
      to: {
        search_regex: /\[:R:\]/g,
        replace_string: '<CC_R>'
      },
      from: {
        search_regex: /<CC_R>/g,
        replace_string: '[\\r\\n\\f\\t\\v]'
      }
    }
  },
};

/**
### getMediaryObjectFromRegexString
> Returns a mediary object from the given regular expression string. This function should be used instead of `getMediaryStringFromRegexString` as this properly handles chracter classes in a "round-trip" fashion.

Parametres:
| name | type | description |
| --- | --- | --- |
| regex_string | {string} | The regular expression string to be converted to a mediary object.  |
| flavour_string | {string} | The flavour of the regex string. \[default: \] |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {object} | A mediary object with the property `mediary_string` and, if necessary, a property `character_class_codes_array`. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

Status:
| version | change |
| --- | --- |
| 0.2.3 | Introduced: Breaking change; function now returns an object with an `intermediary_string` property and a `character_class_codes_array` property if necessary. |
*/
function getMediaryObjectFromRegexString(regex_string: string, flavour_string: Flavour, options = {},) {
  var _return;
  var return_error;
  //Variables
  var i = 0;
  var length = 0;
  var to_object: any = {};
  var to_values_array: any[] = [];
  var character_class_code_matches = null;
  var character_classes_array = [];
  var character_class_codes = [];
  var intermediary_string = regex_string;
  //Parametre checks
  if (typeof (regex_string) !== 'string') {
    return_error = new TypeError('Param "regex_string" is not string.');
    throw return_error;
  }
  if (typeof (flavour_string) !== 'string') {
    return_error = new TypeError('Param "flavour_string" is not string.');
    throw return_error;
  }

  //Function
  to_object = MetaRegexObject[flavour_string];
  //console.log('to_object: %o', to_object);
  to_values_array = Array.from(Object.values(to_object));
  //console.log('to_values_array: %o', to_values_array);
  try {
    //LLT
    intermediary_string = intermediary_string.replace(to_object['LLT'].to.search_regex, to_object['LLT'].to.replace_string);
    //LGT
    intermediary_string = intermediary_string.replace(to_object['LGT'].to.search_regex, to_object['LGT'].to.replace_string);
    //CHARACTER_CLASS
    intermediary_string = intermediary_string.replace(to_object['CHARACTER_CLASS'].to.search_regex, to_object['CHARACTER_CLASS'].to.replace_string);
  } catch (error) {
    return_error = new Error(`Caught an unexpected error processing the special meta-translational symbol: ${error}`);
    throw return_error;
  }
  try {
    character_class_code_matches = intermediary_string.matchAll(to_object['CHARACTER_CLASS_CODE'].to.search_regex);
    //console.log('character_class_code_matches: %o', character_class_code_matches);
    character_classes_array = Array.from(character_class_code_matches);
    //console.log('character_classes_array: %o', character_classes_array);
    for (i = 0; i < character_classes_array.length; i++) {
      length = character_class_codes.push(character_classes_array[i][1]);
      intermediary_string = intermediary_string.replace(to_object['CHARACTER_CLASS'].from.search_regex, `<CHARACTER_CLASS_CODE_START:${(length - 1)}:CHARACTER_CLASS_CODE_END>`);
    }
  } catch (error) {
    return_error = new Error(`Caught an unexpected error when creating character classes code arrays: ${error}`);
    throw return_error;
  }
  for (i = 4; i < to_values_array.length; i++) {
    intermediary_string = intermediary_string.replace(to_values_array[i].to.search_regex, to_values_array[i].to.replace_string);
  }
  _return = {
    mediary_string: intermediary_string,
    character_class_codes_array: character_class_codes
  };

  //Return
  return _return;
}

/**
### getRegexStringFromMediaryObject
> Returns a regex string from the given mediary object formatted to the given regex flavour.

Parametres:
| name | type | description |
| --- | --- | --- |
| mediary_object | {object} | A mediary object with a `mediary_string` and `character_class_codes_array` properties.  |
| flavour_string | {string} | A string repesenting the Regular Expression flavour to return the string in. \[default: 'pcre'\] |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {string} | The regex string translated from the mediary obejct. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

Status:
| version | change |
| --- | --- |
| 0.2.7 | Updated to add improved error handling. |
| 0.2.3 | Introduced |
*/
function getRegexStringFromMediaryObject(mediary_object: any, flavour_string: Flavour, options = {}) {
  var _return;
  var return_error;
  //Variables
  var from_object: any = {};
  var from_values_array: any[] = [];
  var character_class_code_matches: any[] = [];
  //Parametre checks
  if (typeof (mediary_object) !== 'object') {
    return_error = new TypeError('Param "mediary_object" is not object.');
    throw return_error;
  }
  if (typeof (mediary_object.mediary_string) !== 'string') {
    return_error = new TypeError('Property "mediary_string" of "mediary_object" is not a string.');
    throw return_error;
  }
  if (Array.isArray(mediary_object.character_class_codes_array) !== true) {
    return_error = new TypeError('Property "character_class_codes_array" of "mediary_object" is not an array.');
    throw return_error;
  }
  if (typeof (flavour_string) !== 'string') {
    return_error = new TypeError('Param "flavour_string" is not string.');
    throw return_error;
  }
  if (typeof (options) !== 'object') {
    return_error = new TypeError('Param "options" is not ?Object.');
    throw return_error;
  }
  var intermediary_string = mediary_object.mediary_string;
  //Function
  from_object = MetaRegexObject[flavour_string];
  from_values_array = Array.from(Object.values(from_object));
  //NONCAPTURE_GROUP
  intermediary_string = intermediary_string.replace(from_object['NONCAPTURE_GROUP'].from.search_regex, from_object['NONCAPTURE_GROUP'].from.replace_string);
  //NAMED_CAPTURE_GROUP
  intermediary_string = intermediary_string.replace(from_object['NAMED_CAPTURE_GROUP'].from.search_regex, from_object['NAMED_CAPTURE_GROUP'].from.replace_string);
  //LLT
  intermediary_string = intermediary_string.replace(from_object['LLT'].from.search_regex, from_object['LLT'].from.replace_string);
  //LGT
  intermediary_string = intermediary_string.replace(from_object['LGT'].from.search_regex, from_object['LGT'].from.replace_string);
  //CHARACTER_CLASS_CODES
  character_class_code_matches = Array.from(intermediary_string.matchAll(from_object['CHARACTER_CLASS_CODE'].from.search_regex));
  for (var i = 0; i < character_class_code_matches.length; i++) {
    intermediary_string = intermediary_string.replace(from_object['CHARACTER_CLASS_CODE'].from.search_regex, `<CHARACTER_CLASS_START:${mediary_object.character_class_codes_array[character_class_code_matches[i][1]]}:CHARACTER_CLASS_END>`);
  }
  for (i = 5; i < from_values_array.length; i++) {
    intermediary_string = intermediary_string.replace(from_values_array[i].from.search_regex, from_values_array[i].from.replace_string);
  }
  _return = intermediary_string;

  //Return
  return _return;
}
