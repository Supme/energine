<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
    >

    <xsl:output method="html" doctype-system="about:legacy-compat"/>

    <xsl:variable name="BASE" select="/document/properties/property[@name='base']"/>
    <xsl:variable name="STATIC_URL" select="$BASE"/>
    <xsl:variable name="FOLDER" select="$BASE/@folder"></xsl:variable>
    <xsl:variable name="LANG_ABBR" select="/document/properties/property[@name='lang']/@abbr"/>
    <xsl:variable name="IN_DEBUG_MODE"><xsl:value-of select="/document/@debug"/></xsl:variable>

    <xsl:template match="/">
        <xsl:text disable-output-escaping="yes">&lt;!--[if lt IE 7]&gt; &lt;html class="no-js lt-ie9 lt-ie8 lt-ie7"&gt;&lt;![endif]--&gt;</xsl:text>
        <xsl:text disable-output-escaping="yes">&lt;!--[if IE 7]&gt; &lt;html class="no-js lt-ie9 lt-ie8 "&gt;&lt;![endif]--&gt;</xsl:text>
        <xsl:text disable-output-escaping="yes">&lt;!--[if IE 8]&gt; &lt;html class="no-js lt-ie9"&gt;&lt;![endif]--&gt;</xsl:text>
        <xsl:text disable-output-escaping="yes">&lt;!--[if gt IE 8]&gt; &lt;!--&gt;</xsl:text>
        <html  class="no-js">
        <xsl:text disable-output-escaping="yes">&lt;!--&lt;![endif]--&gt;</xsl:text>
            <head>
                <title>Errors</title>
                <base href="{$BASE}"/>

                <link rel="shortcut icon" href="{$STATIC_URL}favicon.ico" type="image/x-icon"/>
                <link rel="icon" href="{$STATIC_URL}favicon.ico" type="image/x-icon"/>
                <link rel="apple-touch-icon" href="{$STATIC_URL}apple-touch-icon.png" />
                <link href="{$STATIC_URL}stylesheets/{$FOLDER}/main.css" rel="stylesheet" type="text/css" media="Screen, projection"/>
            </head>
            <body>
                <xsl:apply-templates select="document"/>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="document">
        <xsl:attribute name="class">error_page</xsl:attribute>
        <div class="base">
            <div class="header">
                <h1 class="logo">
                    <a href="{$BASE}{$LANG_ABBR}"><img src="{$STATIC_URL}images/{$FOLDER}/energine_logo.png" width="246" height="64" alt="Energine"/></a>
                </h1>
            </div>
            <div class="main">
                <xsl:apply-templates select="errors"/>
                <div class="go_back"><a href="{$BASE}{$LANG_ABBR}">Вернуться на главную</a></div>
            </div>
            <div class="footer">
                <xsl:text disable-output-escaping="yes">&amp;copy;</xsl:text>
                Energine 2014
            </div>
        </div>
    </xsl:template>

    <xsl:template match="errors">
        <div class="error_list">
            <xsl:apply-templates/>
        </div>
    </xsl:template>

    <xsl:template match="error">
        <div class="error_item">
            <h1 class="error_name">
                <xsl:value-of select="message" disable-output-escaping="yes"/>
            </h1>
            <xsl:if test="$IN_DEBUG_MODE = 1">
                <div class="error_text">
                    <div><strong>File: </strong><xsl:value-of select="@file"/></div>
                    <div><strong>Line: </strong><xsl:value-of select="@line"/></div>
                </div>
                <xsl:if test="customMessage">
                    <ul>
                        <xsl:apply-templates select="customMessage"/>
                    </ul>
                </xsl:if>

            </xsl:if>
        </div>
    </xsl:template>

    <xsl:template match="customMessage">
        <li><pre><xsl:value-of select="."/></pre></li>
    </xsl:template>

    <xsl:template match="backtrace">
        <ol>
            <xsl:apply-templates />
        </ol>
    </xsl:template>

    <xsl:template match="backtrace/call">
        <li>
            <div><strong><xsl:value-of select="file"/>(<xsl:value-of select="line"/>)</strong></div>
            <div>
                <xsl:value-of select="class"/><xsl:value-of select="type"/><xsl:value-of select="function"/>(<xsl:value-of
                    select="args"/>)
            </div>
        </li>
    </xsl:template>

</xsl:stylesheet>
        